import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as dotenv from "dotenv";
import * as schema from "../../../migrations/schema";
dotenv.config({ path: ".env.local" });

if (!process.env.DATABASE_URL) {
  console.log("🔴 Cannot find database url");
}

const client = postgres(process.env.DATABASE_URL!, { max: 1 });
const db = drizzle(client, { schema });

export default db;
