import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { desc, eq } from 'drizzle-orm';
import { DB } from '../db/db.module';
import type { Database } from '../db/db.module';
import { courses } from '../db/schema';
import type { Course } from '../db/schema';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

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
    const [course] = await this.db
      .select()
      .from(courses)
      .where(eq(courses.id, id));
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
  // UPDATE courses SET ..., updated_at = now() WHERE id = $1 RETURNING *

  async update(id: string, dto: UpdateCourseDto): Promise<Course> {
    const [course] = await this.db
      .update(courses)
      .set({ ...dto, updatedAt: new Date() })
      .where(eq(courses.id, id))
      .returning();

    if (!course) {
      throw new NotFoundException(`Course ${id} not found`);
    }
    return course;
  }

  async remove(id: string): Promise<void> {
    const deleted = await this.db
      .delete(courses)
      .where(eq(courses.id, id))
      .returning({ id: courses.id });
    if (deleted.length == 0) {
      throw new NotFoundException(`Course ${id} not found`);
    }
  }
  async archive(id: string): Promise<Course> {
    return this.setArchivedAt(id, new Date());
  }

  async restore(id: string): Promise<Course> {
    return this.setArchivedAt(id, null);
  }

  private async setArchivedAt(
    id: string,
    archivedAt: Date | null,
  ): Promise<Course> {
    const [course] = await this.db
      .update(courses)
      .set({ archivedAt, updatedAt: new Date() })
      .where(eq(courses.id, id))
      .returning();
    if (!course) throw new NotFoundException(`Course ${id} not found`);
    return course;
  }
}
