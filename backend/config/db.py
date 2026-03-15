import os
import certifi
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")

def get_db_client():
    """
    Initializes the MongoDB client with secure SSL certificates using certifi.
    """
    if not MONGO_URI:
        print("Error: MONGO_URI not found in environment variables.")
        return None

    try:
        # Using certifi.where() provides the correct CA bundle for secure SSL handshakes
        client = MongoClient(
            MONGO_URI, 
            tlsCAFile=certifi.where(),
            serverSelectionTimeoutMS=5000
        )
        
        # Verify connection
        client.admin.command('ping')
        print("MongoDB Atlas: Connection established successfully.")
        return client
        
    except Exception as e:
        print(f"MongoDB Atlas: Connection failed. Error: {e}")
        return None

# --- DATABASE AND COLLECTION INITIALIZATION ---

# Establish connection
_client = get_db_client()

if _client is not None:
    # Set the database name
    db = _client["vastu_bot_db"]
    
    # Define and export collections
    users_collection = db["users"]
    projects_collection = db["projects"]
    
    # Optional: kept for backward compatibility if used elsewhere
    designs_collection = db["projects"] 
else:
    print("Critical: Database connection could not be established.")
    users_collection = None
    projects_collection = None
    designs_collection = None