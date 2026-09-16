from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_env: str = Field(default="local", alias="APP_ENV")
    log_level: str = Field(default="INFO", alias="LOG_LEVEL")
    database_url: str = Field(
        default="postgresql+psycopg://postgres:postgres@localhost:55432/space_coast_explorer",
        alias="DATABASE_URL",
    )
    cms_admin_token: str = Field(default="", alias="CMS_ADMIN_TOKEN")
    jwt_secret_key: str = Field(default="dev-secret-change-in-production", alias="JWT_SECRET_KEY")
    jwt_algorithm: str = Field(default="HS256", alias="JWT_ALGORITHM")
    jwt_expiry_hours: int = Field(default=24, alias="JWT_EXPIRY_HOURS")
    cors_allowed_origins: str = Field(default="", alias="CORS_ALLOWED_ORIGINS")
    launch_provider: str = Field(default="launch_library_2", alias="LAUNCH_PROVIDER")
    launch_library_base_url: str = Field(
        default="https://ll.thespacedevs.com", alias="LAUNCH_LIBRARY_BASE_URL"
    )
    launch_data_mode: str = Field(default="fixture", alias="LAUNCH_DATA_MODE")
    launch_cache_ttl_seconds: int = Field(default=1800, alias="LAUNCH_CACHE_TTL_SECONDS")
    launch_space_coast_pads: str = Field(
        default=(
            "LC-39A,LC-39B,SLC-40,SLC-41,"
            "Launch Complex 39A,Launch Complex 39B,"
            "Space Launch Complex 40,Space Launch Complex 41"
        ),
        alias="LAUNCH_SPACE_COAST_PADS",
    )

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


@lru_cache
def get_settings() -> Settings:
    return Settings()
