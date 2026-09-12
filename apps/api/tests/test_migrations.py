from alembic.config import Config
from alembic.script import ScriptDirectory


def test_single_alembic_head() -> None:
    script = ScriptDirectory.from_config(Config("alembic.ini"))
    assert script.get_heads() == ["0006_m8_billing"]
