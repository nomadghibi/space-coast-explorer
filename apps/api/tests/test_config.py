from app.core.config import Settings


def test_settings_defaults_are_local_safe() -> None:
    settings = Settings()
    assert settings.app_env == "local"
    assert settings.database_url.startswith("postgresql+psycopg://")
