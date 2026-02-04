# Hakan Karsak Akademi — Project Skeleton

This repository contains a starter skeleton for the Hakan Karsak Akademi Next.js + PostgreSQL project.

Quick setup (local):

1. Install dependencies

```bash
npm install
```

2. Create `.env` with at least:

```
DATABASE_URL=postgresql://user:pass@localhost:5432/hka
JWT_SECRET=change-me
```

3. Initialize database (local postgres):

```bash
psql "$DATABASE_URL" -f scripts/init-db.sql
```

4. Run dev server:

```bash
npm run dev
```

Docker:

```bash
docker compose up --build
```

What's included:
- `package.json` — dependencies and scripts
- `docker-compose.yml`, `Dockerfile`, `.dockerignore`
- `scripts/init-db.sql` — DB schema and initial page meta/settings
- `lib/` — `db.ts`, `auth.ts`, `slugify.ts` helpers

Next steps:
- Add UI components under `/components`
- Implement API routes under `/app/api`
- Wire admin routes and middleware
# HK