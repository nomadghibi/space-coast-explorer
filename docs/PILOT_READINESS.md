# Pilot Readiness

Status date: 2026-09-12

## Recommendation

Space Coast Explorer is ready for a stakeholder web demo and internal pilot walkthrough.
It is not yet ready for a public data-collecting field pilot.

## Current State

- M0 through M9 are implemented and documented.
- The public web app is deployed on Vercel.
- The monorepo has passing local quality gates.
- Alembic migrates a fresh PostgreSQL/PostGIS/pgvector database from zero to head.
- The primary metric, Completed Visitor Experiences, has typed event contracts and backend
  summary logic.

## Go For

- Internal stakeholder review.
- Mobile browser walkthrough of public destination and tour pages.
- Manual QA of Cocoa Village Historic Explorer.
- Content review and fact-check pass.
- API deployment rehearsal against a non-production Supabase database.

## No-Go Until Resolved

- Production FastAPI hosting is not configured.
- Production database and object storage environments are not wired.
- CMS auth is still token-based and not a real user/RBAC system.
- Analytics endpoints exist but are not protected by rate limits or abuse controls.
- Public web app does not yet submit pilot analytics events to the API.
- Tour content still includes pilot placeholders that require editorial verification.

## Required Launch Gates

- Deploy FastAPI container with health checks, request IDs, structured logs, and managed secrets.
- Run Alembic against the production database and confirm one head.
- Configure Supabase PostgreSQL with PostGIS and pgvector enabled.
- Configure Cloudflare R2-compatible storage credentials outside the repo.
- Replace local CMS token workflow with production authentication and role checks.
- Add rate limiting to public write endpoints.
- Connect web tour completion events to the analytics API without sending raw GPS trails.
- Complete content fact-check for Cocoa Village Historic Explorer.
- Run mobile QA on iOS Safari and Android Chrome at the actual pilot route.

## Verification Snapshot

- Web lint: passing.
- Workspace typecheck: passing.
- Workspace tests: passing.
- Workspace build: passing.
- API Ruff: passing.
- API mypy: passing.
- API pytest: passing.
- Alembic head: `0007_m9_pilot_analytics`.
- Empty database migration: verified through M9.
- Secrets scan: no obvious committed secrets found.

## Next Engineering Step

Prepare a production API deployment track: container host configuration, managed environment
variables, Supabase database migration runbook, public write rate limits, and analytics event
submission from the active tour completion flow.
