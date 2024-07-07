import { defineConfig } from "drizzle-kit";
import { config } from "dotenv";
config({ path: ".env.local" });

if (!process.env.DATABASE_URL) {
  console.log(process.env);
  console.log("🔴 Cannot find database url");
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/lib/supabase/schema.ts",
  out: "./migrations",
  verbose: true,
  dbCredentials: {
    url: process.env.DATABASE_URL!,
    host: process.env.DATABASE_HOST!,
    port: 5432,
    database: "postgres",
    user: process.env.DATABASE_USER!,
    password: process.env.DATABASE_PASSWORD!,
  },
});
