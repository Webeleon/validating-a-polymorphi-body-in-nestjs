import {
  BadRequestException,
  Body,
  Controller,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { CollegeStudentDto, OnlineStudentDto } from './student.dto';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Controller('student')
export class StudentController {
  @Post()
  signup(
    @Body({
      transform: async (value) => {
        console.log('VALUE', value);
        let transformed: CollegeStudentDto | OnlineStudentDto;
        if (value.college) {
          // use plainToClass with older class-transformer versions
          transformed = plainToInstance(CollegeStudentDto, value);
        } else if (value.platform) {
          transformed = plainToInstance(OnlineStudentDto, value);
        } else {
          throw new BadRequestException('Invalid student signup');
        }

        const validation = await validate(transformed);
        if (validation.length > 0) {
          const validationPipe = new ValidationPipe();
          const exceptionFactory = validationPipe.createExceptionFactory();
          throw exceptionFactory(validation);
        }

        return transformed;
      },
    })
    signupDto: CollegeStudentDto | OnlineStudentDto,
  ) {
    console.log('S', signupDto);
    if (signupDto instanceof CollegeStudentDto) {
      console.log('college');
      return 'college student';
    } else if (signupDto instanceof OnlineStudentDto) {
      console.log('online');
      return 'online student';
    }
    console.log('WTF?');
  }
}
