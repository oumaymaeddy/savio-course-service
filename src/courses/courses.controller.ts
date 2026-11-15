import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { Body, Controller, Get, Param, ParseUUIDPipe, Post } from '@nestjs/common';


@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  // Répond à une requête GET /courses
  @Get()
  findAll() {
    // Demande au service de retourner tous les cours
    return this.coursesService.findAll();
  }
  @Get(':id') // GET /courses/1, /courses/2...
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.coursesService.findOne(id);
  }
  @Post() //Post/courses
  create(@Body() dto: CreateCourseDto) {
    return this.coursesService.create(dto);
  }
}

