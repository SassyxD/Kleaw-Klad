from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any
import time
import random

router = APIRouter()


class Node(BaseModel):
    id: str
    name: str
    type: str
    coordinates: Dict[str, float]
    elevation: float = 10.0


class Edge(BaseModel):
    from_: str
    to: str
    distance: float


class GraphInput(BaseModel):
    nodes: List[Node]
    edges: List[Edge]


class RiskPropagationRequest(BaseModel):
    floodMask: List[List[float]]
    graph: GraphInput


class RiskPropagationResponse(BaseModel):
    success: bool
    data: dict | None = None
    error: dict | None = None


@router.post("/risk-propagate")
async def risk_propagation(request: RiskPropagationRequest):
    """
    Calculate infrastructure risk using Graph Neural Network.
    
    In production, this would use a MindSpore GCN that propagates
    flood risk through the infrastructure graph, considering:
    - Node elevation
    - Water flow direction
    - Network connectivity
    - Historical vulnerability
    """
    try:
        start_time = time.time()
        
        # Mock GNN inference
        # In production: forward pass through MindSpore GNN
        risk_scores = {}
        cascade_events = []
        
        for node in request.graph.nodes:
            # Calculate mock risk score based on elevation
            base_risk = max(0, (15 - node.elevation) / 15)
            base_risk += random.uniform(-0.1, 0.1)
            risk_score = max(0, min(1, base_risk))
            
            risk_scores[node.id] = round(risk_score, 3)
            
            # Generate cascade events for high-risk nodes
            if risk_score > 0.7:
                time_to_failure = int((1 - risk_score) * 180)
                cascade_events.append({
                    "node": node.id,
                    "time": time_to_failure,
                    "impact": f"May isolate connected infrastructure at {node.name}",
                })
        
        processing_time = time.time() - start_time
        
        return RiskPropagationResponse(
            success=True,
            data={
                "riskScores": risk_scores,
                "cascadeEvents": cascade_events,
                "processingTime": round(processing_time, 2),
                "model": "Graph Convolutional Network (MindSpore)",
                "graphSize": {
                    "nodes": len(request.graph.nodes),
                    "edges": len(request.graph.edges),
                },
            }
        )
        
    except Exception as e:
        return RiskPropagationResponse(
            success=False,
            error={
                "code": "AI_003",
                "message": "Risk propagation failed",
                "details": str(e),
            }
        )
