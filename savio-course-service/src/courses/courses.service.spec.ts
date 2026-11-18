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
  describe('create', () => {
    it('inserts the course and returns it', async () => {
      const query = mockQuery([course]);
      db.insert.mockReturnValue(query);
      const dto = {
        name: 'Linear Algebra',
        code: 'MAT1342',
        term: 'Winter 2027',
      };

      await expect(service.create(dto)).resolves.toEqual(course);
      expect(query.values).toHaveBeenCalledWith(dto);
    });
  });

  describe('update', () => {
    it('saves the changes and refreshes updatedAt', async () => {
      const updated = { ...course, term: 'Fall 2027' };
      const query = mockQuery([updated]);
      db.update.mockReturnValue(query);

      await expect(
        service.update(course.id, { term: 'Fall 2027' }),
      ).resolves.toEqual(updated);

      const [changes] = query.set.mock.calls[0] as [
        { term: string; updatedAt: Date },
      ];
      expect(changes.term).toBe('Fall 2027');
      expect(changes.updatedAt).toBeInstanceOf(Date);
    });

    it('throws NotFoundException when the course does not exist', async () => {
      db.update.mockReturnValue(mockQuery([]));

      await expect(
        service.update('unknown-id', { term: 'Fall 2027' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('deletes the course', async () => {
      db.delete.mockReturnValue(mockQuery([{ id: course.id }]));

      await expect(service.remove(course.id)).resolves.toBeUndefined();
    });

    it('throws NotFoundException when nothing was deleted', async () => {
      db.delete.mockReturnValue(mockQuery([]));

      await expect(service.remove('unknown-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
