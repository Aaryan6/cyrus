import { defineConfig, type Config } from "drizzle-kit";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env" });

if (!process.env.DATABASE_URL) {
  console.log("🔴 Cannot find database url");
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/lib/supabase/schema.ts",
  out: "./migrations",
  driver: "pg",
  verbose: true,
  dbCredentials: {
    url: process.env.DATABASE_URL || "",
  },
} as Config);
