# Run from project root
# python -m uvicorn backend.main:app --reload

from fastapi import FastAPI
from backend.api import auth  # adjust import if your folder structure differs

app = FastAPI()

app.include_router(auth.router, prefix="/api", tags=["auth"])
