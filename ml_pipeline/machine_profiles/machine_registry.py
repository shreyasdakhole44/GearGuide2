from typing import Dict, Any

class MachineRegistry:
    """
    MACHINE PROFILE DATABASE
    Stores baseline specifications and safe operational thresholds for machine models.
    """
    
    PROFILES = {
        "ST-900 INDUSTRIAL CORE": {
            "machine_type": "ROBOTIC ARM UNIT",
            "avg_operating_temp": 55.0,
            "max_safe_temp": 85.0,
            "normal_vibration": 0.8,
            "max_vibration": 1.5,
            "max_rpm": 3500,
            "expected_lifetime_hours": 20000,
            "maintenance_interval_days": 30
        },
        "VX-200 MINI ACTUATOR": {
            "machine_type": "LINEAR ACTUATOR",
            "avg_operating_temp": 42.0,
            "max_safe_temp": 70.0,
            "normal_vibration": 0.4,
            "max_vibration": 0.9,
            "max_rpm": 1200,
            "expected_lifetime_hours": 10000,
            "maintenance_interval_days": 60
        },
        "ANTIGRAVITY PROPULSION X1": {
            "machine_type": "AEROSPACE ENGINE",
            "avg_operating_temp": 120.0,
            "max_safe_temp": 450.0,
            "normal_vibration": 2.2,
            "max_vibration": 5.0,
            "max_rpm": 45000,
            "expected_lifetime_hours": 5000,
            "maintenance_interval_days": 7
        }
    }

    @staticmethod
    def get_profile(model_name: str) -> Dict[str, Any]:
        """Retrieve profile by model name, fallback to generic if not found."""
        return MachineRegistry.PROFILES.get(
            model_name.upper(), 
            {
                "machine_type": "GENERIC INDUSTRIAL UNIT",
                "avg_operating_temp": 60.0,
                "max_safe_temp": 90.0,
                "normal_vibration": 1.0,
                "max_vibration": 2.0,
                "max_rpm": 3000,
                "expected_lifetime_hours": 15000,
                "maintenance_interval_days": 30
            }
        )
