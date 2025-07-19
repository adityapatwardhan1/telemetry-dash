import sys
from pathlib import Path
sys.path.append(str(Path(__file__).resolve().parents[1]))

from models import User
from db import get_db

def test_users_seed():
    db = next(get_db())

    # Check if 'admin' user exists
    admin_user = db.query(User).filter_by(username='admin').first()
    assert admin_user is not None, "Admin user should exist after seeding."

    # Check if password looks hashed (not plaintext)
    assert admin_user.hashed_password != 'admin123', "Password should be hashed, not plaintext."

    # Check if 'user' user exists
    user = db.query(User).filter_by(username='user').first()
    assert user is not None, "User should exist after seeding."

    print("All tests passed!")

    db.close()

if __name__ == '__main__':
    test_users_seed()
