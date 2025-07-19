from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError
from backend.db import get_db
from backend.token_utils import decode_access_token
from backend.models import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/login")

async def get_current_user(token: str = Depends(oauth2_scheme), db=Depends(get_db)):
    """
    Gets user from database corresponding to current app user (sent from frontend)
    :param token: JWT token representing the user and relevant info
    :type token: str
    :param db: SessionLocal corresponding to the users database
    :returns: Relevant user entry from the database 
    """
    # Get access token
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    
    # Get user from token
    username = payload.get("sub")
    if not username:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid username")

    # Search User table for someone with the user name
    user = db.query(User).filter(User.username == username).first()
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    
    return user
