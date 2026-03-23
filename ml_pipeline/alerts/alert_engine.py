from typing import Dict, Any, List

class AlertEngine:
    """
    FEATURE 8: Alert System.
    Triggers based on failure probability or specific risk types.
    """
    def __init__(self, risk_threshold: float = 0.8):
        self.risk_threshold = risk_threshold

    def evaluate_risk(self, prediction_result: Dict[str, Any]) -> List[str]:
        alerts = []
        prob = prediction_result.get("failure_probability", 0.0)
        failure_type = prediction_result.get("predicted_failure", "nominal")
        rul = prediction_result.get("remaining_life_hours", 100)

        # 1. Critical Probability Alert
        if prob >= self.risk_threshold:
            alerts.append(f"CRITICAL: {failure_type.upper()} risk detected! Probability: {prob*100}%")

        # 2. RUL Escalation
        if rul < 24:
            alerts.append(f"URGENT: Asset failure predicted within {rul} hours.")

        # 3. Specific Shaft Alert
        if failure_type == "shaft_break" and prob > 0.6:
             alerts.append("SHAFT ALERT: High rotational imbalance detected in drive assembly.")

        return alerts

    def generate_alert_payload(self, prediction_result: Dict[str, Any]) -> Dict[str, Any]:
        alerts = self.evaluate_risk(prediction_result)
        return {
            "has_alerts": len(alerts) > 0,
            "count": len(alerts),
            "severity": "HIGH" if any("CRITICAL" in a for a in alerts) else "NORMAL",
            "messages": alerts,
            "dashboard_flag": True if len(alerts) > 0 else False
        }
