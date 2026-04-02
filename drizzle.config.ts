import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
    dialect: "postgresql",
    schema: "./DB/schema.ts",
    out: "./drizzle",
    dbCredentials: {
        url: process.env.DATABASE_URL!,
    },
    strict: true,
    verbose: true,
});