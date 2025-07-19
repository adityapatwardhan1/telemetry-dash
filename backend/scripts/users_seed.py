# Imports
import sys
from pathlib import Path
sys.path.append(str(Path(__file__).resolve().parents[1]))
from models import User
from auth import hash_password
from db import get_db

def main():
    users_to_insert = [
        {
            "username": "admin",
            "password": "admin123",
            "role": "admin"
        },
        {
            "username": "user",
            "password": "user123",
            "role": "user"
        },
    ]
    
    # Create session
    db = next(get_db())

    try:
        for user_info in users_to_insert:
            # Check if user exists - skip if that is the case
            existing_user = db.query(User).filter_by(username=user_info["username"]).first()
            if existing_user is not None:
                print(f"Attempted to add user with username {user_info['username']}, but they already exist. Skipping.")
                continue
            new_user = User(
                username=user_info["username"],
                hashed_password=hash_password(user_info["password"]),
                role=user_info["role"]
            )
            db.add(new_user)

        db.commit()
    except Exception as e:
        db.rollback()
        print(f"Failed to seed users: {e}")
    finally:
        db.close()


if __name__ == '__main__':
    main()