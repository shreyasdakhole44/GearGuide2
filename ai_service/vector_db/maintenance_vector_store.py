import faiss
import numpy as np
import json
import os
from sentence_transformers import SentenceTransformer

# --- CONFIG ---
DB_PATH = os.path.dirname(os.path.abspath(__file__))
INDEX_FILE = os.path.join(DB_PATH, "maintenance_index.faiss")
MAPPING_FILE = os.path.join(DB_PATH, "log_mapping.json")

# Initialize Embedding Model
model = SentenceTransformer('all-MiniLM-L6-v2')

# Global State
index = None
log_mapping = []

def initialize_db():
    global index, log_mapping
    
    # Load existing mapping
    if os.path.exists(MAPPING_FILE):
        with open(MAPPING_FILE, 'r') as f:
            log_mapping = json.load(f)
            
    # Load existing index or create new
    if os.path.exists(INDEX_FILE):
        index = faiss.read_index(INDEX_FILE)
    else:
        # MiniLM-L6-v2 produces 384-dimensional embeddings
        dimension = 384
        index = faiss.IndexFlatL2(dimension)
        faiss.write_index(index, INDEX_FILE)

def store_maintenance_log(machine_id: str, log_text: str, machine_model: str = "Unknown", machine_type: str = "General"):
    """
    Embeds maintenance text and stores it in FAISS index with enhanced metadata.
    """
    global index, log_mapping
    
    if index is None:
        initialize_db()
        
    embedding = model.encode([log_text])
    faiss.normalize_L2(embedding)
    
    index.add(embedding.astype('float32'))
    
    # Update mapping
    log_entry = {
        "machine_id": machine_id,
        "machine_model": machine_model,
        "machine_type": machine_type,
        "text": log_text,
        "timestamp": str(np.datetime64('now'))
    }
    log_mapping.append(log_entry)
    
    # Persist
    faiss.write_index(index, INDEX_FILE)
    with open(MAPPING_FILE, 'w') as f:
        json.dump(log_mapping, f)
        
    return True

def search_similar_failures(query: str, top_k: int = 5):
    """
    Search for similar historical failures based on a natural language query.
    """
    global index, log_mapping
    
    if index is None:
        initialize_db()
        
    query_embedding = model.encode([query])
    faiss.normalize_L2(query_embedding)
    
    distances, indices = index.search(query_embedding.astype('float32'), top_k)
    
    results = []
    for i in range(len(indices[0])):
        idx = indices[0][i]
        if idx != -1 and idx < len(log_mapping):
            entry = log_mapping[idx].copy()
            entry["score"] = float(distances[0][i])
            results.append(entry)
            
    return results

def get_machine_history(machine_id: str):
    """
    Retrieves all maintenance entries for a specific machine ID.
    """
    global log_mapping
    if not log_mapping:
        initialize_db()
        
    history = [log for log in log_mapping if log["machine_id"] == machine_id]
    return sorted(history, key=lambda x: x['timestamp'], reverse=True)
