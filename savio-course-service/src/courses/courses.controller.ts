import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { UpdateCourseDto } from './dto/update-course.dto';

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
  // Called when the student clicks "Save" in the edit dialog
  @Patch(':id') // PATCH /courses/<uuid>
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateCourseDto) {
    return this.coursesService.update(id, dto);
  }

  // Called when the student confirms "Delete course"
  @Delete(':id') // DELETE /courses/<uuid>
  @HttpCode(204) // success, nothing to send back
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.coursesService.remove(id);
  }
}
