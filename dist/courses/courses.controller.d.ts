import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
export declare class CoursesController {
    private readonly coursesService;
    constructor(coursesService: CoursesService);
    findAll(): import("./courses.service").Course[];
    findOne(id: string): import("./courses.service").Course;
    create(dto: CreateCourseDto): import("./courses.service").Course;
}
