from pathlib import Path


def test_single_alembic_head() -> None:
    versions = list(Path("alembic/versions").glob("*.py"))
    assert [version.name for version in versions] == ["0001_m0_foundation.py"]
