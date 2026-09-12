# Space Coast Explorer Master Blueprint

Space Coast Explorer is a production-quality AI-powered digital tourism platform. It starts with Florida's Space Coast and must later support multiple destinations and white-label deployments.

Initial wedge: Port Canaveral, Cocoa Beach, Cocoa Village. First pilot: Cocoa Village Historic Explorer. Primary metric: Completed Visitor Experiences.

## Stack

Frontend: Next.js 16+, React, TypeScript strict, Tailwind CSS, shadcn/ui. Backend: FastAPI, Python 3.13+, SQLAlchemy 2, Pydantic, Alembic. Database: PostgreSQL, PostGIS, pgvector. Maps: MapLibre GL JS. Deployment assumptions: Vercel, container-hosted FastAPI, Supabase PostgreSQL, Cloudflare R2-compatible object storage.

## Rules

Build milestone by milestone. Keep the repo runnable, tested, documented, type-safe, migration-safe, and deployable. Use structured logging, request IDs, server-side authorization, tenant isolation, Alembic migrations, no committed secrets, and `.env.example`. Do not build M1+ features during M0.

## Multi-Destination Model

Organization -> Destination -> Tours, Businesses, Attractions, Events. Space Coast is the first destination, not the permanent tenant boundary.

## Milestones

M0 Foundation; M1 Public Destination Experience; M2 Map + GPS + Tour Engine; M3 Admin CMS; M4 Audio and Media; M5 AI Guide / RAG; M6 Itinerary + Cruise Companion; M7 Merchant Platform; M8 Billing; M9 Pilot Analytics.
