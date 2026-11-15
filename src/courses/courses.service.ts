import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { desc, eq } from 'drizzle-orm';
import { DB } from '../db/db.module';
import type { Database } from '../db/db.module';
import { courses } from '../db/schema';
import type { Course } from '../db/schema';
import { CreateCourseDto } from './dto/create-course.dto';

@Injectable()
export class CoursesService {
  // NestJS gives us the database (no more list in memory)
  constructor(@Inject(DB) private readonly db: Database) {}

  // SELECT * FROM courses ORDER BY created_at DESC
  async findAll(): Promise<Course[]> {
    return this.db.select().from(courses).orderBy(desc(courses.createdAt));
  }

  // SELECT * FROM courses WHERE id = $1
  async findOne(id: string): Promise<Course> {
    const [course] = await this.db.select().from(courses).where(eq(courses.id, id));
    if (!course) {
      throw new NotFoundException(`Course ${id} not found`);
    }
    return course;
  }

  // INSERT INTO courses (...) VALUES (...) RETURNING *
  async create(dto: CreateCourseDto): Promise<Course> {
    const [course] = await this.db.insert(courses).values(dto).returning();
    return course;
  }
}