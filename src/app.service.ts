import { Inject, Injectable } from '@nestjs/common';
import { sql } from 'drizzle-orm';
import { DB } from './db/db.module';
import type { Database } from './db/db.module';

@Injectable()
export class AppService {
  // NestJS gives us the database (dependency injection)
  constructor(@Inject(DB) private readonly db: Database) {}

  async getHello() {
    // Ask PostgreSQL what time it is: proves the connection works
    const result = await this.db.execute(sql`select now() as now`);
    return { status: 'ok', databaseTime: result.rows[0].now };
  }
}
