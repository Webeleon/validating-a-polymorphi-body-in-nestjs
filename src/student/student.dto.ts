import { IsNotEmpty, IsString } from 'class-validator';

export enum StudentType {
  ONLINE = 'online',
  COLLEGE = 'college',
}

export class StudentDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;
}

export class CollegeStudentDto extends StudentDto {
  @IsString()
  @IsNotEmpty()
  college: string;
}

export class OnlineStudentDto extends StudentDto {
  @IsString()
  @IsNotEmpty()
  platform: string;
}
