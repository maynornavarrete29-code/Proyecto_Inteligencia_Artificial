from urllib.parse import quote_plus

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables using Pydantic v2."""

    DB_SERVER: str = ""
    DB_NAME: str = ""
    DB_USER: str = ""
    DB_PASSWORD: str = ""

    DB_PORT: int = 1433
    DB_DRIVER: str = "ODBC Driver 17 for SQL Server"
    DB_ENCRYPT: str = "yes"
    DB_TRUST_CERT: str = "yes"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    @property
    def database_url(self) -> str:
        """Genera una URL compatible con SQLAlchemy utilizando quote_plus."""
        server: str = (
            f"{self.DB_SERVER},{self.DB_PORT}"
            if self.DB_PORT
            else self.DB_SERVER
        )

        odbc_str = (
            f"Driver={{{self.DB_DRIVER}}};"
            f"Server={server};"
            f"Database={self.DB_NAME};"
            f"UID={self.DB_USER};"
            f"PWD={self.DB_PASSWORD};"
            f"Encrypt={self.DB_ENCRYPT};"
            f"TrustServerCertificate={self.DB_TRUST_CERT};"
        )
        return f"mssql+pyodbc:///?odbc_connect={quote_plus(odbc_str)}"


settings = Settings()
