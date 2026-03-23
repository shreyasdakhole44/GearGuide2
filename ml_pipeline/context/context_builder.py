from typing import Dict, Any
from ml_pipeline.machine_profiles.machine_registry import MachineRegistry

class ContextBuilder:
    """
    MACHINE CONTEXT INJECTION LAYER
    Provides baseline metadata for high-precision diagnostic explanations.
    """

    @staticmethod
    def build_machine_context(machine_id: str, machine_model: str) -> Dict[str, Any]:
        """
        Fetches machine profile and returns context for the reasoning layer.
        """
        registry = MachineRegistry()
        profile = registry.get_profile(machine_model)
        
        # Enrich with machine ID and additional context markers
        context = {
            "machine_id": machine_id,
            "machine_model": machine_model,
            "machine_type": profile.get("machine_type"),
            "baseline_avg_temp": profile.get("avg_operating_temp"),
            "baseline_max_safe_temp": profile.get("max_safe_temp"),
            "baseline_normal_vibration": profile.get("normal_vibration"),
            "baseline_max_vibration": profile.get("max_vibration"),
            "expected_lifetime": profile.get("expected_lifetime_hours"),
            "maintenance_interval": profile.get("maintenance_interval_days"),
            "context_status": "HIGH-FIDELITY ACTIVE"
        }
        
        return context

context_builder = ContextBuilder()
