import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { CreateCourseDto } from './dto/create-course.dto';

// Describes what a course looks like (TypeScript checks we respect it)
export interface Course {
  id: string;
  name: string;
  code?: string;
  term?: string;
}

@Injectable()
export class CoursesService {
  // Temporary data kept in memory (will be replaced by the database)
  private courses: Course[] = [
    { id: '1', name: 'Data Structures', code: 'ITI1121', term: 'Fall 2026' },
    { id: '2', name: 'Linear Algebra', code: 'MAT1341', term: 'Fall 2026' },
  ];

  findAll(): Course[] {
    return this.courses;
  }

  findOne(id: string): Course {
    const course = this.courses.find((c) => c.id === id);
    if (!course) {
      throw new NotFoundException(`Course ${id} not found`);
    }
    return course;
  }

  create(dto: CreateCourseDto): Course {
    const course: Course = { id: randomUUID(), ...dto };
    this.courses.push(course);
    return course;
  }
} // ← the class ends here: every function must be ABOVE this brace
