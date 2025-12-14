import type { Config } from "drizzle-kit";
import { loadEnvConfig } from "@next/env";

const projectDir = (process as any).cwd();
loadEnvConfig(projectDir);

export default {
  schema: "./lib/schema.ts",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
} satisfies Config;