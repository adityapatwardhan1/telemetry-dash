# from fastapi import APIRouter, Depends
# from models import User
# from dependencies import get_current_user  # Adjust import as needed

# router = APIRouter()

# @router.get("/me", response_model=User)
# async def read_users_me(current_user: User = Depends(get_current_user)):
#     print("in read_users_me")
#     """
#     Returns the currently authenticated user.
#     """
#     return current_user
