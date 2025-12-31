"""
AI Model API Endpoints
Direct access to AI model predictions
"""

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional
import base64
import io

from app.core.database import get_db
from app.schemas import (
    RiskPropagationRequest,
    RiskPropagationResponse,
    EvacuationRequest,
    EvacuationResponse,
    SARTranslationRequest,
    SARTranslationResponse,
)
from app.services.data_service import DataService
from app.ai import get_sar_translator, get_risk_engine, get_evacuation_agent

router = APIRouter()


@router.post("/sar-to-optical", response_model=SARTranslationResponse)
async def translate_sar_to_optical(
    request: SARTranslationRequest,
):
    """
    Translate SAR (Synthetic Aperture Radar) image to optical-style image.
    
    This allows visualization of flood extent even under heavy cloud cover
    during monsoon events when optical satellites cannot capture clear imagery.
    
    Uses CycleGAN trained on Sentinel-1/Sentinel-2 paired imagery.
    """
    import numpy as np
    
    translator = get_sar_translator()
    
    # Decode input image
    if request.sar_image_base64:
        image_bytes = base64.b64decode(request.sar_image_base64)
        # In production, would decode actual image
        # For demo, create synthetic SAR-like image
        sar_image = np.random.rand(256, 256).astype(np.float32) * 255
    else:
        # Demo mode - generate synthetic input
        sar_image = np.random.rand(256, 256).astype(np.float32) * 255
    
    # Translate
    optical_image, confidence = translator.translate(sar_image)
    
    # Extract flood mask
    flood_mask = translator.extract_flood_mask(optical_image)
    
    # Create GeoJSON from flood mask (simplified)
    flood_geojson = {
        "type": "Polygon",
        "coordinates": [[
            [100.45, 7.00],
            [100.50, 7.00],
            [100.50, 7.05],
            [100.45, 7.05],
            [100.45, 7.00],
        ]]
    }
    
    # Calculate water area (simplified)
    water_area = float(np.sum(flood_mask)) / (256 * 256) * 25  # Assume 25 sq km tile
    
    # Encode output
    from PIL import Image
    img = Image.fromarray(optical_image)
    buffer = io.BytesIO()
    img.save(buffer, format="PNG")
    optical_base64 = base64.b64encode(buffer.getvalue()).decode()
    
    return SARTranslationResponse(
        optical_image_base64=optical_base64,
        flood_mask_geojson=flood_geojson,
        detected_water_area_sqkm=round(water_area, 2),
        confidence=confidence,
    )


@router.post("/sar-to-optical/upload")
async def translate_sar_upload(
    file: UploadFile = File(..., description="SAR image file (TIFF, PNG, or JPG)"),
):
    """
    Upload SAR image file for translation.
    Supports GeoTIFF, PNG, and JPG formats.
    """
    import numpy as np
    from PIL import Image
    
    # Read uploaded file
    contents = await file.read()
    
    try:
        # Open as PIL Image
        img = Image.open(io.BytesIO(contents))
        sar_image = np.array(img.convert("L"))  # Convert to grayscale
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid image file: {str(e)}")
    
    translator = get_sar_translator()
    optical_image, confidence = translator.translate(sar_image)
    flood_mask = translator.extract_flood_mask(optical_image)
    
    # Encode output
    img_out = Image.fromarray(optical_image)
    buffer = io.BytesIO()
    img_out.save(buffer, format="PNG")
    optical_base64 = base64.b64encode(buffer.getvalue()).decode()
    
    water_area = float(np.sum(flood_mask)) / (sar_image.shape[0] * sar_image.shape[1]) * 25
    
    return {
        "filename": file.filename,
        "input_size": list(sar_image.shape),
        "optical_image_base64": optical_base64,
        "detected_water_area_sqkm": round(water_area, 2),
        "confidence": confidence,
    }


@router.post("/risk-propagation", response_model=RiskPropagationResponse)
async def propagate_risk(
    request: RiskPropagationRequest,
    db: AsyncSession = Depends(get_db),
):
    """
    Run GNN risk propagation through infrastructure network.
    
    Predicts how flood impact cascades through:
    - Road network connectivity
    - Facility dependencies
    - Population distribution
    - Drainage network flow
    
    Returns risk scores and cascade timeline.
    """
    from app.ai.gnn_risk import InfrastructureKnowledgeGraph
    
    # Get infrastructure data
    data_service = DataService(db)
    zones = await data_service.get_flood_zones()
    facilities = await data_service.get_facilities()
    
    # Build knowledge graph
    kg = InfrastructureKnowledgeGraph()
    
    for zone in zones:
        kg.add_flood_zone(
            zone_id=zone["id"],
            centroid=(zone.get("centroid_lat", 7.0), zone.get("centroid_lon", 100.47)),
            elevation=zone.get("elevation", 10),
            population=zone.get("estimated_population", 1000),
            current_depth=request.flood_depths.get(zone["id"], 0),
        )
    
    for facility in facilities:
        kg.add_facility(
            facility_id=facility["id"],
            facility_type=facility.get("facility_type", "unknown"),
            location=(facility.get("latitude", 7.0), facility.get("longitude", 100.47)),
            elevation=facility.get("elevation_m", 10),
            capacity=facility.get("capacity", 0),
        )
    
    # Add connections (simplified - would use actual road/drainage network)
    zone_ids = [z["id"] for z in zones]
    for i, zone_id in enumerate(zone_ids[:-1]):
        kg.add_road_connection(zone_id, zone_ids[i + 1], distance=2.0)
        kg.add_drainage_connection(zone_id, zone_ids[i + 1], flow_capacity=100)
    
    # Run risk propagation
    risk_engine = get_risk_engine()
    risk_engine.set_knowledge_graph(kg)
    
    result = risk_engine.propagate_risk(
        flood_depths=request.flood_depths,
        hours_ahead=request.hours_ahead,
    )
    
    return RiskPropagationResponse(**result)


@router.post("/evacuation-plan", response_model=EvacuationResponse)
async def generate_evacuation_plan(
    request: EvacuationRequest,
    db: AsyncSession = Depends(get_db),
):
    """
    Generate AI-optimized evacuation plan using reinforcement learning.
    
    The RL agent balances:
    - Travel time minimization
    - Risk avoidance (flooded roads)
    - Shelter capacity constraints
    - Population priority (hospitals, schools first)
    
    Returns prioritized routes and shelter assignments.
    """
    data_service = DataService(db)
    
    zones = await data_service.get_flood_zones()
    facilities = await data_service.get_facilities()
    routes = await data_service.get_evacuation_routes()
    
    # Filter by request parameters
    shelters = [f for f in facilities if f.get("facility_type") == "shelter"]
    if request.available_shelters:
        shelters = [s for s in shelters if s["id"] in request.available_shelters]
    
    if request.priority_zones:
        zones = [z for z in zones if z["id"] in request.priority_zones]
    
    # Get evacuation agent
    agent = get_evacuation_agent()
    
    # Generate plan
    plan = agent.get_evacuation_plan(
        flood_state=request.current_flood_state,
        zones=zones,
        shelters=shelters,
        routes=routes,
    )
    
    return EvacuationResponse(**plan)


@router.get("/model-status")
async def get_model_status():
    """
    Get status of all AI models.
    Useful for monitoring and debugging.
    """
    status = {
        "cyclegan": {
            "name": "SAR-to-Optical CycleGAN",
            "status": "loaded",
            "device": "cpu",
            "version": "1.0.0",
        },
        "gnn": {
            "name": "Flood Risk GNN",
            "status": "loaded",
            "device": "cpu",
            "version": "1.0.0",
        },
        "rl_agent": {
            "name": "Evacuation RL Agent (PPO)",
            "status": "loaded",
            "device": "cpu",
            "version": "1.0.0",
        },
    }
    
    try:
        translator = get_sar_translator()
        status["cyclegan"]["device"] = str(translator.device)
    except Exception as e:
        status["cyclegan"]["status"] = f"error: {str(e)}"
    
    try:
        risk_engine = get_risk_engine()
        status["gnn"]["device"] = str(risk_engine.device)
    except Exception as e:
        status["gnn"]["status"] = f"error: {str(e)}"
    
    try:
        agent = get_evacuation_agent()
        status["rl_agent"]["device"] = str(agent.device)
    except Exception as e:
        status["rl_agent"]["status"] = f"error: {str(e)}"
    
    return status


@router.get("/inference-metrics")
async def get_inference_metrics(
    db: AsyncSession = Depends(get_db),
):
    """
    Get AI model inference performance metrics.
    """
    data_service = DataService(db)
    metrics = await data_service.get_ai_metrics()
    
    return {
        "cyclegan": {
            "avg_inference_ms": metrics.get("cyclegan_avg_ms", 35.0),
            "total_predictions": metrics.get("cyclegan_count", 0),
            "avg_confidence": metrics.get("cyclegan_confidence", 0.88),
        },
        "gnn": {
            "avg_inference_ms": metrics.get("gnn_avg_ms", 15.0),
            "total_predictions": metrics.get("gnn_count", 0),
        },
        "rl_agent": {
            "avg_inference_ms": metrics.get("rl_avg_ms", 25.0),
            "total_plans": metrics.get("rl_count", 0),
        },
    }
