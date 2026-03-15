import os
import sys
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables from the .env file at the project root
load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")

def get_db_client():
    """
    Initializes the MongoDB client and verifies the connection via a ping.
    """
    if not MONGO_URI:
        print("Error: MONGO_URI not found in environment variables.")
        return None

    try:
        # tlsAllowInvalidCertificates=True handles local SSL/CA certificate issues
        client = MongoClient(
            MONGO_URI, 
            tlsAllowInvalidCertificates=True,
            serverSelectionTimeoutMS=5000
        )
        
        # Verify connection
        client.admin.command('ping')
        print("MongoDB Atlas: Connection established successfully.")
        return client
        
    except Exception as e:
        print(f"MongoDB Atlas: connection failed. Error: {e}")
        return None

# --- DATABASE AND COLLECTION INITIALIZATION ---

# Establish connection
_client = get_db_client()

if _client is not None:
    # Set the database name
    db = _client["interior_design_db"]
    
    # Define and export collections
    users_collection = db["users"]
    designs_collection = db["designs"]
    projects_collection = db["projects"]
else:
    # Prevent the application from running if the database is unreachable
    print("Critical: Database connection could not be established. Exiting.")
    users_collection = None
    designs_collection = None
    projects_collection = None