# Deployment

Web targets Vercel. API and worker target containers. Database targets Supabase PostgreSQL. Object storage targets Cloudflare R2-compatible S3.

## Web

Vercel builds the Next.js app from the root using `vercel.json`.

Required production web variables:

- `NEXT_PUBLIC_API_BASE_URL`: public HTTPS origin for the FastAPI service, for example `https://space-coast-explorer-api.example.com`
- `NEXT_PUBLIC_MAP_STYLE_URL`: production MapLibre style URL
- `NEXT_PUBLIC_ENABLE_LAUNCH_FIXTURES=false`
- `NEXT_PUBLIC_ANALYTICS_API_ENABLED=true` only after the API is deployed and analytics ingestion is ready

Do not enable `NEXT_PUBLIC_ENABLE_LAUNCH_FIXTURES` in production unless the deployment is intentionally a demo review.

## API

The FastAPI app has a container entrypoint at `apps/api/Dockerfile`.

Container start command:

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

Production API variables:

- `APP_ENV=production`
- `LOG_LEVEL=INFO`
- `DATABASE_URL`: Supabase PostgreSQL URL using the SQLAlchemy async-compatible driver format expected by the app
- `CMS_ADMIN_TOKEN`: managed secret value
- `CORS_ALLOWED_ORIGINS=https://space-coast-explorer.vercel.app`
- `LAUNCH_DATA_MODE=production`
- `LAUNCH_LIBRARY_BASE_URL=https://ll.thespacedevs.com`
- `LAUNCH_PROVIDER=launch_library_2`
- `LAUNCH_CACHE_TTL_SECONDS=1800`
- `LAUNCH_SPACE_COAST_PADS=LC-39A,LC-39B,SLC-40,SLC-41,Launch Complex 39A,Launch Complex 39B,Space Launch Complex 40,Space Launch Complex 41`

After deploy, verify:

```bash
curl -sS https://YOUR_API_HOST/health
curl -sS https://YOUR_API_HOST/api/v1/public/launches/next
```

Then set Vercel:

```bash
vercel env add NEXT_PUBLIC_API_BASE_URL production
vercel env add NEXT_PUBLIC_ENABLE_LAUNCH_FIXTURES production
vercel --prod
```

`NEXT_PUBLIC_API_BASE_URL` must be the API origin only, with no trailing `/api`.
