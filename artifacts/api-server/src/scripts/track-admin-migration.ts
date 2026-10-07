import { db } from "@workspace/db";
import { sql } from "drizzle-orm";

try {
  await db.execute(sql`ALTER TABLE tracks ADD COLUMN IF NOT EXISTS archived_at timestamp, ADD COLUMN IF NOT EXISTS deleted_at timestamp`);
  console.log("Track archive column is ready.");
  process.exit(0);
} catch (err) {
  console.error("Track archive migration failed:", err instanceof Error ? err.message : "Unknown error");
  process.exit(1);
}
