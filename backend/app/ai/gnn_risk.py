"""
Graph Neural Network for Flood Risk Propagation
Hydraulic-aware GNN that models cascading effects through infrastructure knowledge graph
"""

import torch
import torch.nn as nn
import torch.nn.functional as F
from torch_geometric.nn import GCNConv, GATConv, global_mean_pool
from torch_geometric.data import Data
from typing import Dict, List, Tuple, Optional, Any
import numpy as np
import networkx as nx
from loguru import logger
from datetime import datetime, timedelta


class FloodGCN(nn.Module):
    """
    Graph Convolutional Network for flood risk propagation
    Learns how flood impact cascades through infrastructure network
    """
    
    def __init__(
        self,
        node_features: int = 8,
        hidden_channels: int = 64,
        num_layers: int = 3,
        output_features: int = 1,
        dropout: float = 0.1,
    ):
        super().__init__()
        
        self.num_layers = num_layers
        self.dropout = dropout
        
        # Input projection
        self.input_proj = nn.Linear(node_features, hidden_channels)
        
        # GCN layers
        self.convs = nn.ModuleList()
        for _ in range(num_layers):
            self.convs.append(GCNConv(hidden_channels, hidden_channels))
        
        # Layer normalization
        self.norms = nn.ModuleList([
            nn.LayerNorm(hidden_channels) for _ in range(num_layers)
        ])
        
        # Output layers
        self.output = nn.Sequential(
            nn.Linear(hidden_channels, hidden_channels // 2),
            nn.ReLU(),
            nn.Dropout(dropout),
            nn.Linear(hidden_channels // 2, output_features),
            nn.Sigmoid(),  # Risk score between 0 and 1
        )
    
    def forward(self, x: torch.Tensor, edge_index: torch.Tensor) -> torch.Tensor:
        # Input projection
        x = self.input_proj(x)
        x = F.relu(x)
        
        # Message passing layers
        for i in range(self.num_layers):
            x_residual = x
            x = self.convs[i](x, edge_index)
            x = self.norms[i](x)
            x = F.relu(x)
            x = F.dropout(x, p=self.dropout, training=self.training)
            x = x + x_residual  # Residual connection
        
        # Output
        return self.output(x)


class FloodGAT(nn.Module):
    """
    Graph Attention Network variant with attention-based aggregation
    Better for capturing variable importance of neighboring nodes
    """
    
    def __init__(
        self,
        node_features: int = 8,
        hidden_channels: int = 64,
        num_heads: int = 4,
        num_layers: int = 2,
        output_features: int = 1,
        dropout: float = 0.1,
    ):
        super().__init__()
        
        self.input_proj = nn.Linear(node_features, hidden_channels)
        
        self.convs = nn.ModuleList()
        self.convs.append(GATConv(hidden_channels, hidden_channels // num_heads, heads=num_heads, dropout=dropout))
        
        for _ in range(num_layers - 1):
            self.convs.append(GATConv(hidden_channels, hidden_channels // num_heads, heads=num_heads, dropout=dropout))
        
        self.output = nn.Sequential(
            nn.Linear(hidden_channels, hidden_channels // 2),
            nn.ReLU(),
            nn.Dropout(dropout),
            nn.Linear(hidden_channels // 2, output_features),
            nn.Sigmoid(),
        )
    
    def forward(self, x: torch.Tensor, edge_index: torch.Tensor) -> torch.Tensor:
        x = self.input_proj(x)
        x = F.elu(x)
        
        for conv in self.convs:
            x = conv(x, edge_index)
            x = F.elu(x)
        
        return self.output(x)


class InfrastructureKnowledgeGraph:
    """
    Knowledge graph representing Hat Yai's infrastructure network
    Nodes: Flood zones, facilities, intersections
    Edges: Roads, drainage connections, dependencies
    """
    
    def __init__(self):
        self.graph = nx.DiGraph()
        self.node_to_idx: Dict[str, int] = {}
        self.idx_to_node: Dict[int, str] = {}
        
        # Node feature dimensions
        self.node_feature_names = [
            "elevation",
            "is_flood_zone",
            "is_hospital",
            "is_shelter",
            "is_power",
            "is_school",
            "current_depth",
            "population",
        ]
    
    def add_flood_zone(
        self,
        zone_id: str,
        centroid: Tuple[float, float],
        elevation: float,
        population: int,
        current_depth: float = 0.0,
    ):
        """Add a flood zone node"""
        idx = len(self.node_to_idx)
        self.node_to_idx[zone_id] = idx
        self.idx_to_node[idx] = zone_id
        
        self.graph.add_node(
            zone_id,
            idx=idx,
            node_type="flood_zone",
            lat=centroid[0],
            lon=centroid[1],
            elevation=elevation,
            population=population,
            current_depth=current_depth,
            risk_score=0.0,
        )
    
    def add_facility(
        self,
        facility_id: str,
        facility_type: str,
        location: Tuple[float, float],
        elevation: float,
        capacity: int = 0,
    ):
        """Add a facility node"""
        idx = len(self.node_to_idx)
        self.node_to_idx[facility_id] = idx
        self.idx_to_node[idx] = facility_id
        
        self.graph.add_node(
            facility_id,
            idx=idx,
            node_type="facility",
            facility_type=facility_type,
            lat=location[0],
            lon=location[1],
            elevation=elevation,
            capacity=capacity,
            current_depth=0.0,
            risk_score=0.0,
        )
    
    def add_road_connection(
        self,
        source_id: str,
        target_id: str,
        distance: float,
        road_type: str = "road",
        min_elevation: float = 0.0,
    ):
        """Add road edge between nodes"""
        if source_id in self.graph and target_id in self.graph:
            self.graph.add_edge(
                source_id,
                target_id,
                edge_type="road",
                distance=distance,
                road_type=road_type,
                min_elevation=min_elevation,
                is_passable=True,
            )
    
    def add_drainage_connection(
        self,
        upstream_id: str,
        downstream_id: str,
        flow_capacity: float,
    ):
        """Add drainage network edge (water flows downstream)"""
        if upstream_id in self.graph and downstream_id in self.graph:
            self.graph.add_edge(
                upstream_id,
                downstream_id,
                edge_type="drainage",
                flow_capacity=flow_capacity,
                flow_direction="downstream",
            )
    
    def get_node_features(self) -> torch.Tensor:
        """Extract node feature matrix"""
        num_nodes = len(self.graph.nodes)
        features = np.zeros((num_nodes, len(self.node_feature_names)))
        
        for node_id, data in self.graph.nodes(data=True):
            idx = data["idx"]
            
            features[idx, 0] = data.get("elevation", 0) / 100  # Normalize elevation
            features[idx, 1] = 1.0 if data.get("node_type") == "flood_zone" else 0.0
            features[idx, 2] = 1.0 if data.get("facility_type") == "hospital" else 0.0
            features[idx, 3] = 1.0 if data.get("facility_type") == "shelter" else 0.0
            features[idx, 4] = 1.0 if data.get("facility_type") == "power_station" else 0.0
            features[idx, 5] = 1.0 if data.get("facility_type") == "school" else 0.0
            features[idx, 6] = data.get("current_depth", 0) / 3  # Normalize depth (max 3m)
            features[idx, 7] = min(data.get("population", 0) / 10000, 1.0)  # Normalize population
        
        return torch.tensor(features, dtype=torch.float32)
    
    def get_edge_index(self) -> torch.Tensor:
        """Get edge index tensor for PyG"""
        edges = list(self.graph.edges())
        if not edges:
            return torch.zeros((2, 0), dtype=torch.long)
        
        edge_index = []
        for source, target in edges:
            source_idx = self.node_to_idx[source]
            target_idx = self.node_to_idx[target]
            edge_index.append([source_idx, target_idx])
        
        return torch.tensor(edge_index, dtype=torch.long).t().contiguous()
    
    def to_pyg_data(self) -> Data:
        """Convert to PyTorch Geometric Data object"""
        x = self.get_node_features()
        edge_index = self.get_edge_index()
        return Data(x=x, edge_index=edge_index)
    
    def update_flood_depths(self, depths: Dict[str, float]):
        """Update current flood depths for zones"""
        for node_id, depth in depths.items():
            if node_id in self.graph:
                self.graph.nodes[node_id]["current_depth"] = depth


class RiskPropagationEngine:
    """
    GNN-based risk propagation engine
    Predicts cascading effects of floods on infrastructure
    """
    
    def __init__(self, model_path: Optional[str] = None, device: str = "auto"):
        self.device = self._get_device(device)
        self.model = FloodGCN(
            node_features=8,
            hidden_channels=64,
            num_layers=3,
        ).to(self.device)
        
        if model_path:
            self.load_model(model_path)
        
        self.model.eval()
        self.knowledge_graph: Optional[InfrastructureKnowledgeGraph] = None
        
        logger.info(f"GNN Risk Propagation Engine initialized on {self.device}")
    
    def _get_device(self, device: str) -> torch.device:
        if device == "auto":
            if torch.cuda.is_available():
                return torch.device("cuda")
            return torch.device("cpu")
        return torch.device(device)
    
    def load_model(self, path: str):
        """Load pre-trained model weights"""
        try:
            state_dict = torch.load(path, map_location=self.device)
            self.model.load_state_dict(state_dict)
            logger.info(f"Loaded GNN model from {path}")
        except Exception as e:
            logger.warning(f"Could not load model from {path}: {e}")
    
    def set_knowledge_graph(self, kg: InfrastructureKnowledgeGraph):
        """Set the infrastructure knowledge graph"""
        self.knowledge_graph = kg
    
    @torch.no_grad()
    def propagate_risk(
        self,
        flood_depths: Dict[str, float],
        hours_ahead: int = 6,
    ) -> Dict[str, Any]:
        """
        Propagate flood risk through infrastructure network
        
        Args:
            flood_depths: Current flood depths by zone ID
            hours_ahead: Prediction horizon in hours
            
        Returns:
            Dictionary containing risk scores and cascade timeline
        """
        if self.knowledge_graph is None:
            raise ValueError("Knowledge graph not set. Call set_knowledge_graph() first.")
        
        import time
        start_time = time.time()
        
        # Update flood depths
        self.knowledge_graph.update_flood_depths(flood_depths)
        
        # Get graph data
        data = self.knowledge_graph.to_pyg_data().to(self.device)
        
        # Run GNN
        risk_scores = self.model(data.x, data.edge_index)
        risk_scores = risk_scores.squeeze().cpu().numpy()
        
        # Map scores back to node IDs
        zone_risk_scores = {}
        facility_risk_scores = {}
        route_risk_scores = {}
        critical_warnings = []
        
        for node_id, node_data in self.knowledge_graph.graph.nodes(data=True):
            idx = node_data["idx"]
            score = float(risk_scores[idx]) * 100  # Convert to 0-100 scale
            
            if node_data["node_type"] == "flood_zone":
                zone_risk_scores[node_id] = score
            else:
                facility_risk_scores[node_id] = score
                
                # Generate warnings for high-risk facilities
                if score > 70:
                    critical_warnings.append({
                        "facility_id": node_id,
                        "facility_type": node_data.get("facility_type", "unknown"),
                        "risk_score": score,
                        "warning_level": "critical" if score > 85 else "high",
                        "message": f"{node_id} at {score:.0f}% risk of flood impact",
                    })
        
        # Generate cascade timeline (simplified simulation)
        cascade_timeline = self._simulate_cascade(flood_depths, hours_ahead)
        
        inference_time = (time.time() - start_time) * 1000
        logger.debug(f"Risk propagation completed in {inference_time:.2f}ms")
        
        return {
            "zone_risk_scores": zone_risk_scores,
            "facility_risk_scores": facility_risk_scores,
            "route_risk_scores": route_risk_scores,
            "critical_warnings": sorted(critical_warnings, key=lambda x: -x["risk_score"]),
            "cascade_timeline": cascade_timeline,
        }
    
    def _simulate_cascade(
        self,
        initial_depths: Dict[str, float],
        hours: int,
    ) -> List[Dict[str, Any]]:
        """Simulate cascading effects over time"""
        timeline = []
        current_time = datetime.now()
        
        for hour in range(hours):
            # Simplified cascade simulation
            affected_nodes = []
            for node_id, depth in initial_depths.items():
                if depth > 0.5 + (hour * 0.1):  # Increasing threshold over time
                    affected_nodes.append({
                        "node_id": node_id,
                        "event": "flooded",
                        "depth": depth,
                    })
            
            if affected_nodes:
                timeline.append({
                    "time": (current_time + timedelta(hours=hour)).isoformat(),
                    "hour": hour,
                    "events": affected_nodes,
                })
        
        return timeline


# Singleton instance
_risk_engine_instance: Optional[RiskPropagationEngine] = None


def get_risk_engine() -> RiskPropagationEngine:
    """Get or create the risk propagation engine singleton"""
    global _risk_engine_instance
    if _risk_engine_instance is None:
        from app.core.config import settings
        _risk_engine_instance = RiskPropagationEngine(
            model_path=settings.GNN_MODEL_PATH if settings.GNN_MODEL_PATH else None
        )
    return _risk_engine_instance
