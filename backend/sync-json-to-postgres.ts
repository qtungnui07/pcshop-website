import { SQL } from "bun";

const DATABASE_URL = Bun.env.DATABASE_URL || "postgres://pcshop:pcshop@localhost:5432/pcshop";
const DB_DIR = "./backend/db";
const COLLECTIONS = [
  "pcs",
  "components",
  "laptops",
  "accessories",
  "accessoryCombos",
  "tickets",
  "accounts",
  "orders",
  "payments",
] as const;

const sql = new SQL(DATABASE_URL);

await sql`
  CREATE TABLE IF NOT EXISTS app_collections (
    name TEXT PRIMARY KEY,
    data JSONB NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )
`;

for (const name of COLLECTIONS) {
  const file = Bun.file(`${DB_DIR}/${name}.json`);
  if (!(await file.exists())) {
    console.warn(`[Sync] Skip ${name}: file not found`);
    continue;
  }

  const data = await file.json();
  if (!Array.isArray(data)) {
    throw new Error(`${name}.json must contain an array`);
  }

  await sql`
    INSERT INTO app_collections (name, data, updated_at)
    VALUES (${name}, ${data}::jsonb, NOW())
    ON CONFLICT (name) DO UPDATE
    SET data = EXCLUDED.data, updated_at = NOW()
  `;
  console.log(`[Sync] ${name}: ${data.length} records`);
}

await sql.close();
console.log("[Sync] JSON → PostgreSQL completed");
