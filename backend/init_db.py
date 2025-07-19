from models import Base
from db import engine

# Initialize the database
if __name__ == '__main__':
    Base.metadata.create_all(bind=engine)