
import os
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import firebase_admin
from firebase_admin import auth, credentials
from dotenv import load_dotenv

load_dotenv()

# Initialize Firebase Admin
# Check if we have credentials file or environment variables
cred_path = os.getenv("FIREBASE_CREDENTIALS")

if not firebase_admin._apps:
    if cred_path and os.path.exists(cred_path):
        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred)
    else:
        # Fallback to default (Google Cloud environment or similar)
        # Or you can initialize with empty options if just testing locally without admin SDK privileges (but verify_id_token needs project ID)
        print("Warning: No FIREBASE_CREDENTIALS found. Assuming implicit environment or emulator.")
        firebase_admin.initialize_app()

security = HTTPBearer()

async def get_current_user(token: HTTPAuthorizationCredentials = Depends(security)):
    try:
        decoded_token = auth.verify_id_token(token.credentials)
        return decoded_token
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid authentication credentials: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )
