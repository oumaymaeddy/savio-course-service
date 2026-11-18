import { NotFoundException } from '@nestjs/common';
import type { Database } from '../db/db.module';
import type { Course } from '../db/schema';
import { CoursesService } from './courses.service';

// A fake Drizzle query: every chained method returns the same object,
// and `await` on it gives back `result`.
function mockQuery<T>(result: T) {
  const query = {
    from: jest.fn(),
    where: jest.fn(),
    orderBy: jest.fn(),
    values: jest.fn(),
    set: jest.fn(),
    returning: jest.fn(),
    then: (
      onFulfilled: (value: T) => unknown,
      onRejected?: (reason: unknown) => unknown,
    ) => Promise.resolve(result).then(onFulfilled, onRejected),
  };
  [
    query.from,
    query.where,
    query.orderBy,
    query.values,
    query.set,
    query.returning,
  ].forEach((fn) => fn.mockReturnValue(query));
  return query;
}

describe('CoursesService', () => {
  // A sample course, like the one in your real database
  const course: Course = {
    id: '93a936e0-fd36-462a-8b15-17a1feef56ad',
    name: 'Linear Algebra',
    code: 'MAT1342',
    term: 'Winter 2027',
    createdAt: new Date('2026-11-15T14:32:14Z'),
    updatedAt: new Date('2026-11-15T14:32:14Z'),
    archivedAt: null,
  };

  // The fake database: only the 4 entry points the service uses
  const db = {
    select: jest.fn(),
    insert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
  let service: CoursesService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new CoursesService(db as unknown as Database);
  });

  describe('findAll', () => {
    it('returns the courses from the database', async () => {
      db.select.mockReturnValue(mockQuery([course]));

      await expect(service.findAll()).resolves.toEqual([course]);
    });
  });

  describe('findOne', () => {
    it('returns the course when it exists', async () => {
      db.select.mockReturnValue(mockQuery([course]));

      await expect(service.findOne(course.id)).resolves.toEqual(course);
    });

    it('throws NotFoundException when the course does not exist', async () => {
      db.select.mockReturnValue(mockQuery([]));

      await expect(service.findOne('unknown-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
