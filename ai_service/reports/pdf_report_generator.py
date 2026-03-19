from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.lib.units import inch
import os

def generate_maintenance_report(report_data: dict, output_path: str):
    """
    Generates a professional PDF maintenance report.
    """
    c = canvas.Canvas(output_path, pagesize=letter)
    width, height = letter
    
    # --- HEADER ---
    c.setFillColor(colors.HexColor("#0f172a")) # Industrial Dark
    c.rect(0, height - 1.5*inch, width, 1.5*inch, fill=1)
    
    c.setFillColor(colors.white)
    c.setFont("Helvetica-Bold", 24)
    c.drawString(0.5*inch, height - 0.75*inch, "SENTINEL CORE: ASSET DIAGNOSTIC")
    
    c.setFont("Helvetica", 10)
    c.drawString(0.5*inch, height - 1.1*inch, "AUTONOMOUS INFRASTRUCTURE CONTROLLER | MISSION CRITICAL REPORT")
    
    # --- ASSET INFO ---
    c.setFillColor(colors.black)
    c.setFont("Helvetica-Bold", 14)
    c.drawString(0.5*inch, height - 2*inch, f"Asset ID: {report_data.get('machine_id', 'N/A')}")
    
    # --- STATUS SUMMARY ---
    is_critical = report_data.get('is_critical', False)
    status_color = colors.red if is_critical else colors.green
    c.setFillColor(status_color)
    c.setFont("Helvetica-Bold", 16)
    c.drawString(0.5*inch, height - 2.5*inch, f"STATUS: {report_data.get('summary', 'UNKNOWN')}")
    
    # --- SENSOR SNAPSHOT ---
    c.setFillColor(colors.black)
    c.setFont("Helvetica-Bold", 12)
    c.drawString(0.5*inch, height - 3*inch, "Sensor Snapshot:")
    
    c.setFont("Helvetica", 10)
    y = height - 3.25*inch
    snapshot = report_data.get("real_time_sensor_snapshot", {})
    if isinstance(snapshot, dict):
        for key, val in snapshot.items():
            c.drawString(0.7*inch, y, f"• {key.replace('_', ' ').title()}: {val}")
            y -= 15
    
    # --- DIAGNOSTIC HIGHLIGHTS ---
    y -= 10
    c.setFont("Helvetica-Bold", 12)
    c.drawString(0.5*inch, y, "Neural Insight & Analysis:")
    y -= 20
    
    c.setFont("Helvetica-Oblique", 11)
    c.drawString(0.5*inch, y, f"Diagnostic: {report_data.get('neural_insight', 'N/A')}")
    y -= 15
    
    c.setFont("Helvetica", 10)
    reason = report_data.get('reason', 'N/A')
    # Simple wrap text logic
    text_obj = c.beginText(0.5*inch, y)
    text_obj.setFont("Helvetica", 10)
    text_obj.setLeading(12)
    lines = [reason[i:i+90] for i in range(0, len(reason), 90)]
    for line in lines:
        text_obj.textLine(line)
    c.drawText(text_obj)
    
    y -= (len(lines) * 15 + 10)
    
    # --- METRICS ---
    c.setFont("Helvetica-Bold", 12)
    c.drawString(0.5*inch, y, "Performance Metrics:")
    y -= 20
    c.setFont("Helvetica", 10)
    c.drawString(0.7*inch, y, f"Failure Probability: {report_data.get('failure_probability', '0%')}")
    y -= 15
    c.drawString(0.7*inch, y, f"Confidence Score: {report_data.get('confidence_score', '0%')}")
    y -= 15
    c.drawString(0.7*inch, y, f"Priority Level: {report_data.get('priority_level', 'NORMAL')}")
    y -= 15
    c.drawString(0.7*inch, y, f"Predicted Failure Window: {report_data.get('predicted_failure_time', 'N/A')}")
    
    # --- ECONOMIC IMPACT ---
    y -= 30
    c.setFillColor(colors.HexColor("#1e293b"))
    c.rect(0.5*inch, y - 0.5*inch, width - 1*inch, 0.6*inch, fill=1)
    c.setFillColor(colors.white)
    c.setFont("Helvetica-Bold", 12)
    c.drawString(0.7*inch, y - 0.2*inch, f"ECONOMIC IMPACT: {report_data.get('potential_savings', '$0.00')} - ROI: {report_data.get('roi_projection', '0%')}")
    
    # --- FOOTER ---
    c.setFillColor(colors.gray)
    c.setFont("Helvetica", 8)
    c.drawCentredString(width/2, 0.5*inch, "SENTINEL PREDICTIVE MAINTENANCE CORE v2.0 | SECURE INDUSTRIAL REPORT")
    
    c.save()
    return output_path
