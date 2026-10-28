import { CreateCourseDto } from './dto/create-course.dto';
export interface Course {
    id: string;
    name: string;
    code?: string;
    term?: string;
}
export declare class CoursesService {
    private courses;
    findAll(): Course[];
    findOne(id: string): Course;
    create(dto: CreateCourseDto): Course;
}
