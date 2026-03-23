from typing import Dict, Any, List, Optional

class DecisionEngine:
    """
    POST-PREDICTION REASONING LAYER
    Ensures logical consistency between failure probability and system status.
    """

    THRESHOLDS = {
        "HEALTHY": 0.30,
        "WARNING": 0.60,
        "DEGRADED": 0.80,
        "CRITICAL": 1.00
    }

    @staticmethod
    def correct_prediction(report: Dict[str, Any], context: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        Normalizes prediction outputs based on final_prob and machine context.
        Safety: Does NOT override GUARDRAIL_INTERVENTION.
        """
        if report.get("guardrail_status") == "GUARDRAIL_INTERVENTION":
            return report

        # Extract probability
        prob = report.get("failure_probability")
        if isinstance(prob, str) and "%" in prob:
            prob = float(prob.replace("%", "")) / 100.0
        else:
            prob = report.get("final_prob") or float(prob or 0.0)
        
        # Determine Status & Consistency Data
        if prob < DecisionEngine.THRESHOLDS["HEALTHY"]:
            system_status = "HEALTHY"
            display_status = "STABLE OPERATION"
            insight = "All operational parameters within nominal thresholds."
            priority = "LOW"
            timeline = "Routine Maintenance Cycle"
            actions = ["Continue standard monitoring", "Monthly inspection"]
        elif prob < DecisionEngine.THRESHOLDS["WARNING"]:
            system_status = "WARNING"
            display_status = "CAUTION REQUIRED"
            insight = "Accelerated Wear Detected - Variance in vibration FFT"
            priority = "MEDIUM"
            timeline = "Schedule inspection within 7 days"
            actions = ["Inspect drive assembly", "Check lubrication levels"]
        elif prob < DecisionEngine.THRESHOLDS["DEGRADED"]:
            system_status = "DEGRADED"
            display_status = "PERFORMANCE DEGRADED"
            insight = "Significant Structural Fatigue Detected"
            priority = "HIGH"
            timeline = "Inspect within 24-48 hours"
            actions = ["Full system diagnostic", "Reduce machine load", "Immediate tech review"]
        else:
            system_status = "CRITICAL"
            display_status = "CRITICAL CONDITION"
            insight = "Imminent Mechanical Failure - Critical Torque Spikes"
            priority = "CRITICAL"
            timeline = "IMMEDIATE DISPATCH"
            actions = ["Emergency shutdown authorized", "Immediate component replacement", "Safe-state engagement"]

        # CONTEXT-AWARE ENHANCEMENT
        if context:
            machine_model = context.get("machine_model", "Standard Unit")
            baseline_temp = context.get("baseline_avg_temp")
            
            # Extract actual temperature from sensor snapshot if available
            snapshot = report.get("real_time_sensor_snapshot", {})
            actual_temp = float(snapshot.get("temperature", 0))

            if baseline_temp and actual_temp > baseline_temp:
                diff = actual_temp - baseline_temp
                context_insight = f"The {machine_model} typically operates at {baseline_temp}°C. Current temperature ({actual_temp}°C) shows a {diff:.1f}°C deviation."
                insight = f"{insight} | {context_insight}"

        # Update report fields dynamically
        report["status"] = system_status
        report["system_status"] = display_status
        report["neural_insight"] = insight
        report["mission_priority"] = priority
        report["dispatch_timeline"] = timeline
        report["recommended_actions"] = actions
        report["failure_probability"] = f"{prob * 100:.1f}%"

        return report

decision_engine = DecisionEngine()
