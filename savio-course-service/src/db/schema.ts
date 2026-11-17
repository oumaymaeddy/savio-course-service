import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

// The "courses" table: one row = one course
export const courses = pgTable('courses', {
  //Une table PostgreSQL nommée courses
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 80 }).notNull(),
  code: varchar('code', { length: 20 }),
  term: varchar('term', { length: 40 }),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  archivedAt: timestamp('archived_at', { withTimezone: true }),
});

// TypeScript type of a course, deduced from the table
export type Course = typeof courses.$inferSelect;
