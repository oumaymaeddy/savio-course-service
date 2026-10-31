import { existsSync } from 'node:fs';
import { defineConfig } from 'drizzle-kit';

// Read DATABASE_URL from the .env file
if (existsSync('.env')) process.loadEnvFile('.env');

export default defineConfig({
  dialect: 'postgresql', // the type of database
  schema: './src/db/schema.ts', // where our tables are described
  out: './drizzle', // where migration files will be written
  dbCredentials: { url: process.env.DATABASE_URL! },
});
