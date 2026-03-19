import fitz  # PyMuPDF
import re

def extract_text_from_pdf(pdf_path: str) -> str:
    """
    Extracts raw text from a maintenance PDF.
    """
    try:
        doc = fitz.open(pdf_path)
        text = ""
        for page in doc:
            text += page.get_text()
        return text
    except Exception as e:
        return f"PDF Extraction Error: {str(e)}"

def parse_maintenance_data(text: str) -> dict:
    """
    Parses machine ID, sensor data, and technician notes from extracted text.
    Matches the existing prediction model's input schema.
    """
    data = {}
    
    # Extract Machine ID / Asset
    machine_match = re.search(r"Asset[:\s]+([A-Z0-9-]+)", text, re.I)
    if machine_match:
        data["machine_id"] = machine_match.group(1)
    
    # Extract Sensor Values (Example patterns)
    # Temperature: 92 C
    temp_match = re.search(r"Temperature[:\s]+(\d+\.?\d*)", text, re.I)
    if temp_match:
        data["temperature"] = float(temp_match.group(1))

    # Vibration: 1.2 mm/s
    vibr_match = re.search(r"Vibration[:\s]+(\d+\.?\d*)", text, re.I)
    if vibr_match:
        data["vibration"] = float(vibr_match.group(1))

    # Torque: 85 Nm
    torque_match = re.search(r"Torque[:\s]+(\d+\.?\d*)", text, re.I)
    if torque_match:
        data["torque"] = float(torque_match.group(1))

    # RPM: 3500
    rpm_match = re.search(r"RPM[:\s]+(\d+)", text, re.I)
    if rpm_match:
        data["rpm"] = int(rpm_match.group(1))

    # Maintenance Logs / Notes
    notes_match = re.search(r"Notes[:\s]+(.*)", text, re.I | re.DOTALL)
    if notes_match:
        data["maintenance_log"] = notes_match.group(1).strip()

    return data
