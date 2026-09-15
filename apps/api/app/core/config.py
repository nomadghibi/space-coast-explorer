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
    launch_provider: str = Field(default="launch_library_2", alias="LAUNCH_PROVIDER")
    launch_library_base_url: str = Field(
        default="https://ll.thespacedevs.com", alias="LAUNCH_LIBRARY_BASE_URL"
    )
    launch_data_mode: str = Field(default="fixture", alias="LAUNCH_DATA_MODE")
    launch_cache_ttl_seconds: int = Field(default=1800, alias="LAUNCH_CACHE_TTL_SECONDS")
    launch_space_coast_pads: str = Field(
        default="LC-39A,LC-39B,SLC-40,SLC-41", alias="LAUNCH_SPACE_COAST_PADS"
    )

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


@lru_cache
def get_settings() -> Settings:
    return Settings()
