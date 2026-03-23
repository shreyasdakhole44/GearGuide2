import re
from typing import Dict, Any, List

class LogIngestor:
    """
    NLP-lite module to extract failure events from human maintenance logs.
    """
    FAILURE_KEYWORDS = {
        "shaft_break": ["shaft", "break", "snapped", "broken", "coupling"],
        "overheating": ["hot", "temp", "smoke", "overheat", "melt"],
        "bearing_failure": ["bearing", "noise", "grinding", "seized"],
        "vibration_issue": ["vibe", "shake", "shaking", "vibrating", "asymmetric"]
    }

    def __init__(self):
        pass

    def extract_failure_events(self, text: str) -> List[str]:
        found_events = []
        text_lower = text.lower()
        for event, keywords in self.FAILURE_KEYWORDS.items():
            if any(keyword in text_lower for keyword in keywords):
                found_events.append(event)
        return found_events

    def process_log(self, raw_log: Dict[str, Any]) -> Dict[str, Any]:
        text = raw_log.get("log_text", "")
        events = self.extract_failure_events(text)
        raw_log["extracted_tags"] = events
        return raw_log
