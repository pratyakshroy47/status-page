from setuptools import setup, find_packages

setup(
    name="status-page-backend",
    version="0.1",
    packages=find_packages(),
    install_requires=[
        "fastapi[all]",
        "sqlalchemy",
        "psycopg2-binary",
        "python-dotenv",
        "alembic",
        "pydantic-settings"
    ],
) 