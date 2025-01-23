import sys
import os
from pathlib import Path

BACKEND_DIR = str(Path(__file__).resolve().parent.parent)
sys.path.insert(0, BACKEND_DIR)

from sqlalchemy import inspect
from app.db.session import engine

def verify_tables():
    inspector = inspect(engine)
    tables = inspector.get_table_names()
    print("\nExisting tables:")
    for table in tables:
        print(f"- {table}")

if __name__ == "__main__":
    verify_tables() 