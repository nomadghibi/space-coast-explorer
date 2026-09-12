# Space Coast Explorer Agent Guide

Read `docs/MASTER_BLUEPRINT.md`, `PROJECT_CONTEXT.md`, `docs/ARCHITECTURE.md`, and `docs/MILESTONES.md` before architecture or behavior changes.

## Purpose

Space Coast Explorer is a mobile-first tourism platform that begins with Florida's Space Coast and must support multiple destinations.

## Commands

- Install: `pnpm install`
- Web lint: `pnpm lint`
- Web typecheck: `pnpm typecheck`
- Web tests: `pnpm test`
- Web build: `pnpm build`
- API lint: `cd apps/api && .venv/bin/ruff check .`
- API typecheck: `cd apps/api && .venv/bin/mypy .`
- API tests: `cd apps/api && .venv/bin/pytest`
- Dependencies: `docker compose -f infra/docker-compose.yml up -d`
- Migrations: `cd apps/api && .venv/bin/alembic upgrade head`

## Rules

Keep domain logic out of framework entry points. Never hard-code Space Coast as the only destination. Never commit secrets. Use UUIDs, UTC timestamps, Alembic, structured JSON logs, request IDs, and server-side authorization. Do not suppress type errors or build future milestone features early. Update docs and ADRs when architecture changes.
