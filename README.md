# PC Shop

## Run with Docker

Copy `.env.example` to `.env`, set a strong `POSTGRES_PASSWORD`, then run:

```bash
docker compose up -d --build
```

The backend creates the PostgreSQL schema automatically. On the first startup it imports each existing `backend/db/*.json` collection into PostgreSQL; the JSON files remain untouched as a backup.

To overwrite PostgreSQL collections with the current JSON files again:

```bash
docker compose exec backend bun run db:sync-json
```

Adminer is available locally at `http://localhost:8081`. Sign in with:

- System: `PostgreSQL`
- Server: `postgres`
- Username/database: values from `POSTGRES_USER` and `POSTGRES_DB` in `.env`
- Password: `POSTGRES_PASSWORD` from `.env`

## Run without Docker

Install Bun 1.3+, start a PostgreSQL instance, then set `DATABASE_URL` and run:

```bash
bun install
DATABASE_URL=postgres://pcshop:pcshop@localhost:5432/pcshop bun run backend
bun run dev
```
