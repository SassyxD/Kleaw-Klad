"""
AI Module Initialization
Klaew Klad AI Components:
- CycleGAN: SAR-to-Optical translation
- GNN: Risk propagation through infrastructure graph
- RL Agent: Evacuation planning optimization
"""

from app.ai.cyclegan import SARToOpticalTranslator, get_sar_translator
from app.ai.gnn_risk import (
    FloodGCN,
    InfrastructureKnowledgeGraph,
    RiskPropagationEngine,
    get_risk_engine,
)
from app.ai.rl_evacuation import (
    EvacuationAgent,
    EvacuationEnvironment,
    get_evacuation_agent,
)

__all__ = [
    # CycleGAN
    "SARToOpticalTranslator",
    "get_sar_translator",
    # GNN
    "FloodGCN",
    "InfrastructureKnowledgeGraph",
    "RiskPropagationEngine",
    "get_risk_engine",
    # RL
    "EvacuationAgent",
    "EvacuationEnvironment",
    "get_evacuation_agent",
]
