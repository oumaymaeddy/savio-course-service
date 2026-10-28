import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

// The data a client must send to create a course, with its rules
export class CreateCourseDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  code?: string;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  term?: string;
}
