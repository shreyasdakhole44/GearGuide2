import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

# Initialize Groq client
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def generate_root_cause(machine_report: dict) -> str:
    """
    Generates a technical explanation for the root cause based on model results.
    """
    insight = machine_report.get("neural_insight", "Unknown")
    reason = machine_report.get("reason", "N/A")
    prob = machine_report.get("failure_probability", "0%")
    
    prompt = f"""
    [SYSTEM: SENTINEL INDUSTRIAL REASONER]
    ASSET DIAGNOSTIC: {insight}
    TECHNICAL REASON: {reason}
    FAILURE PROBABILITY: {prob}

    TASKS:
    Provide a concise, high-fidelity technical explanation of the root cause. 
    Focus on mechanical/electrical dynamics. 
    DO NOT predict probability. Use ONLY the provided model output.

    EXPLANATION:
    """
    
    try:
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.2,
            max_tokens=150
        )
        return completion.choices[0].message.content.strip()
    except Exception as e:
        return f"Reasoning link disrupted: {str(e)}"

def generate_maintenance_explanation(machine_report: dict) -> str:
    """
    Generates a detailed explanation for recommended maintenance actions.
    """
    actions = ", ".join(machine_report.get("recommended_actions", []))
    insight = machine_report.get("neural_insight", "Unknown")

    prompt = f"""
    [SYSTEM: SENTINEL MAINTENANCE ADVISOR]
    DIAGNOSTIC: {insight}
    RECOMMENDED ACTIONS: {actions}

    TASKS:
    Explain WHY these maintenance actions are critical to preventing the failure pattern detected.
    Be technical and precise. 
    Format as a single authoritative paragraph.

    MAINTENANCE STRATEGY:
    """

    try:
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.2,
            max_tokens=150
        )
        return completion.choices[0].message.content.strip()
    except Exception as e:
        return f"Maintenance briefing unavailable: {str(e)}"

def answer_operator_query(machine_report: dict, question: str) -> str:
    """
    Answers specific operator questions based ONLY on the machine report.
    """
    prompt = f"""
    [SYSTEM: SENTINEL COMMAND INTERFACE]
    MACHINE REPORT: {machine_report}
    OPERATOR QUERY: {question}

    RULES:
    1. Answer ONLY based on the provided report.
    2. If the answer is not in the report, state 'DATA NOT IN DIAGNOSTIC RECORD'.
    3. Maintain an industrial/authoritative tone.
    4. DO NOT generate new predictions.

    RESPONSE:
    """

    try:
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.1,
            max_tokens=200
        )
        return completion.choices[0].message.content.strip()
    except Exception as e:
        return "Neural query failed to propagate."
