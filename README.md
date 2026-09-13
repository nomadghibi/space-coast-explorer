# Space Coast Explorer

Production monorepo for a multi-destination tourism platform beginning with Florida's Space Coast.

## Prerequisites

Node.js 22+, pnpm 11+, Python 3.13+, Docker.

## Install

```bash
pnpm install
cd apps/api && python3 -m venv .venv && .venv/bin/pip install -e '.[dev]'
```

## Environment

```bash
cp .env.example .env
```

## Database

```bash
docker compose -f infra/docker-compose.yml up -d
cd apps/api && .venv/bin/alembic upgrade head
```

## Run

```bash
pnpm dev
cd apps/api && .venv/bin/uvicorn app.main:app --reload
```

## Quality Gates

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
cd apps/api && .venv/bin/ruff check . && .venv/bin/mypy . && .venv/bin/pytest
```

## Pilot Readiness

All documented milestones M0 through M9 are implemented. See `docs/PILOT_READINESS.md`
for the current launch recommendation, no-go items, and next production API deployment track.
