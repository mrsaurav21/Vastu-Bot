import os
from google.oauth2 import id_token
from google.auth.transport import requests

# Fetch the Client ID from environment variables
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")

def verify_google_token(token: str):
    """
    Validates the integrity of the Google JWT token.
    Returns the decoded user information if valid, else returns None.
    """
    try:
        # Verify the token against Google's OAuth2 servers
        user_info = id_token.verify_oauth2_token(
            token, 
            requests.Request(), 
            GOOGLE_CLIENT_ID
        )
        return user_info
    except ValueError:
        # This occurs if the token is expired or malformed
        return None
    except Exception as e:
        print(f"Internal Auth Service Error: {e}")
        return None