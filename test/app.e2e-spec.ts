import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('/student (post) college student', async () => {
    return request(app.getHttpServer())
      .post('/student')
      .send({
        college: 'MIT',
        firstName: 'foo',
        lastName: 'bar',
      })
      .expect(201)
      .expect('college student');
  });

  it('/student (post) online student', async () => {
    return request(app.getHttpServer())
      .post('/student')
      .send({
        platform: 'udemy',
        firstName: 'foo',
        lastName: 'bar',
      })
      .expect(201)
      .expect('online student');
  });
});
