from jose import JWTError, jwt
from datetime import datetime, timedelta, timezone
from dotenv import load_dotenv
import os
from pathlib import Path

# Load .env from project root folder relative to this file
env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

SECRET_KEY = os.getenv("SECRET_KEY")
print("Loaded SECRET_KEY:", SECRET_KEY)
# SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

def create_access_token(data: dict, expires_delta: timedelta = None):
    """
    Creates a JWT access token from data
    :param data: User data to be encoded into an access token
    :type data: dict
    :param expires_delta: The amount of time after which the token expires
    :type expires_delta: timedelta
    :returns: A JWT access token encoding the relevant user information 
    and expiration time data
    """
    data_to_encode = data.copy()
    expire_time = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    data_to_encode.update({"exp": expire_time})
    return jwt.encode(data_to_encode, key=SECRET_KEY, algorithm=ALGORITHM)

def decode_access_token(token):
    """
    Decodes a JWT access token
    :param token: The token to decode
    :type token: str
    :returns: The decoded JWT token or None if invalid
    """
    print("Incoming token:", token)
    print("SECRET_KEY=", SECRET_KEY)
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError as e:
        print("JWT error occurred")
        print(e)
        return None
