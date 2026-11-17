import { Global, Inject, Module, OnApplicationShutdown } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

// "Names" used to ask NestJS for the database: @Inject(DB)
export const DB = Symbol('DB');
export const PG_POOL = Symbol('PG_POOL');

// The type of our database client (knows our tables)
export type Database = NodePgDatabase<typeof schema>;

@Global() // available in every module without importing it again
@Module({
  providers: [
    {
      // 1. The connection pool: a few connections kept open and reused
      provide: PG_POOL,
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        new Pool({ connectionString: config.getOrThrow<string>('DATABASE_URL') }),
    },
    {
      // 2. Drizzle, using that pool
      provide: DB,
      inject: [PG_POOL],
      useFactory: (pool: Pool): Database => drizzle(pool, { schema }),
    },
  ],
  exports: [DB],
})
export class DbModule implements OnApplicationShutdown {
  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  // Close the connections cleanly when the server stops
  async onApplicationShutdown() {
    await this.pool.end();
  }
}