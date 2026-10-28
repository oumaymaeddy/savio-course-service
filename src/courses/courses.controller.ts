import { CoursesService } from './courses.service';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';

// Toutes les routes de ce contrôleur commencent par /courses
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
  findOne(@Param('id') id: string) {
    return this.coursesService.findOne(id);
  }
  @Post() //Post/courses
  create(@Body() dto: CreateCourseDto) {
    return this.coursesService.create(dto);
  }
}
