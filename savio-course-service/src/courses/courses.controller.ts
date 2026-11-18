import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseBoolPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UpdateCourseDto } from './dto/update-course.dto';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  // Répond à une requête GET /courses
  @Get()
  findAll(
    @Query('archived', new ParseBoolPipe({ optional: true }))
    archived?: boolean,
  ) {
    return this.coursesService.findAll(archived);
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
  @Patch(':id/archive')
  archive(@Param('id', ParseUUIDPipe) id: string) {
    return this.coursesService.archive(id);
  }

  @Patch(':id/restore')
  restore(@Param('id', ParseUUIDPipe) id: string) {
    return this.coursesService.restore(id);
  }

  // Called when the student confirms "Delete course"
  @Delete(':id') // DELETE /courses/<uuid>
  @HttpCode(204) // success, nothing to send back
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.coursesService.remove(id);
  }
}
