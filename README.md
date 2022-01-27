# Validating a polymorphic body in nest JS

Sometimes, an issue rise, this time I had to validate a body that could be of two distinct forms.
I could have chosen to build a big dto mixing both classes validation.
But in the end, it was kind of ugly, lacking the inherent elegance of Nest.

Today, I'll share with you my solution and the reasons for its necessity.
![party](https://media.giphy.com/media/l0HepqxN0nzQVsHss/giphy.gif)

Here is our target controller method signature:
```ts
import { Controller, Post } from '@nestjs/common';
import { CollegeStudentDto, OnlineStudentDto } from './student.dto';

@Controller('student')
export class StudentController {
  @Post()
  signup(signupDto: CollegeStudentDto | OnlineStudentDto) {
    return 'call the service and apply some logic'
  }
}

```

Looks nice, eh?
Unfortunately, it won't work. The reflected metadata used in the [ValidationPipe](https://docs.nestjs.com/techniques/validation) only knows how to cast to one class.
It can't discriminate the data and guess which of the classes to use for validation.

Ok, first thing first, let's define the DTOs:
```ts 
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
```

![wonderful](https://media.giphy.com/media/xT1XGXgGPvHCBc2XsY/giphy.gif)

So, how can we compensate for these limitations?
Easy! use setup our own transform pipe in the `@Body()` annotation

```ts
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
    if (signupDto instanceof CollegeStudentDto) {
      return 'college student';
    } else if (signupDto instanceof OnlineStudentDto) {
      return 'online student';
    }
  }
}
```
And that's it!
Now you know!

## Questions?

![questions?](https://media.giphy.com/media/DUrdT2xEmJWbS/giphy.gif)

I'll be glad to answers questions in the comments.

If you liked my discord consider joining my coding lair!
:phone:[Webeleon coding lair on discord](https://discord.gg/h7HzYzD82p)

You can also email me and offer me a contract :moneybag:
:envelope:[Email me!](julien@webeleon.dev)

And since I'm a nice guy, here, take this sample repo containing a working codebase!
:gift:[Get the code of the tuto from github](https://github.com/Webeleon/validating-a-polymorphic-body-in-nestjs)

<script type="text/javascript" src="https://cdnjs.buymeacoffee.com/1.0.0/button.prod.min.js" data-name="bmc-button" data-slug="webeleon" data-color="#FFDD00" data-emoji="" data-font="Cookie" data-text="Buy me a coffee" data-outline-color="#000000" data-font-color="#000000" data-coffee-color="#ffffff" ></script>
