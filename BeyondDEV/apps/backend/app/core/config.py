from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """Application settings loaded from environment variables using pydantic v2

    The settings class reads values from a local `.env` by default and exposes
    a `database_url` property ready to be used by SQLAlchemy with the pyodbc driver.
    """

    DB_HOST: str
    DB_PORT: int = 1433
    DB_NAME: str
    DB_USER: str
    DB_PASSWORD: str

    # pydantic v2 settings configuration
    model_config = {
        "env_file": ".env",
        "env_file_encoding": "utf-8",
    }

    @property
    def database_url(self) -> str:
        """Return a SQLAlchemy-compatible URL using the odbc_connect approach.

        This avoids issues with special characters in the password or other fields
        by URL-encoding the full ODBC connection string.
        """
        from urllib.parse import quote_plus

        driver = "ODBC Driver 18 for SQL Server"
        server = f"{self.DB_HOST},{self.DB_PORT}" if self.DB_PORT else self.DB_HOST
        odbc_str = (
            f"Driver={driver};"
            f"Server={server};"
            f"Database={self.DB_NAME};"
            f"UID={self.DB_USER};"
            f"PWD={self.DB_PASSWORD};"
            "Encrypt=no;TrustServerCertificate=yes;"
        )
        return f"mssql+pyodbc:///?odbc_connect={quote_plus(odbc_str)}"


# Singleton settings instance
settings = Settings()
