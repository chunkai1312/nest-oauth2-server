import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from './app/app.module';

describe('Test App', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('GET /', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('GET /oauth/token', () => {
    return request(app.getHttpServer())
      .get('/oauth/token')
      .expect(400)
      .then((res) => {
        expect(res.body.error).toBe('invalid_request');
        expect(res.body.error_description).toBe(
          'Invalid request: method must be POST',
        );
      });
  });

  it('no header POST /oauth/token', () => {
    return request(app.getHttpServer())
      .post('/oauth/token')
      .expect(400)
      .then((res) => {
        expect(res.body.error).toBe('invalid_request');
        expect(res.body.error_description).toBe(
          'Invalid request: content must be application/x-www-form-urlencoded',
        );
      });
  });

  it('incorrect Authorization POST /oauth/token', () => {
    return request(app.getHttpServer())
      .post('/oauth/token')
      .set({
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Basic qazwsx',
      })
      .send({
        grant_type: 'password',
        username: 'foo',
        password: 'bar',
      })
      .expect(400)
      .then((res) => {
        expect(res.body.error).toBe('invalid_client');
        expect(res.body.error_description).toBe(
          'Invalid client: cannot retrieve client credentials',
        );
      });
  });

  it('correct Authorization POST /oauth/token', () => {
    return request(app.getHttpServer())
      .post('/oauth/token')
      .set({
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Basic MTIzNDU6c2VjcmV0', // Basic base64(12345:secret)
      })
      .send({
        grant_type: 'password',
        username: 'foo',
        password: 'bar',
      })
      .expect(200)
      .then((res) => {
        expect(res.body.token_type).toBe('Bearer');
      });
  });

  it('incorrect GET /user', () => {
    return request(app.getHttpServer())
      .get('/user')
      .expect(401)
      .then((res) => {
        expect(res.body.statusCode).toBe(401);
        expect(res.body.message).toBe('Unauthorized');
      });
  });

  it('correct GET /user', () => {
    return request(app.getHttpServer())
      .get('/user')
      .set({
        Authorization: 'Bearer a051f2d3c361bae20b95e0fa6d2b3cb155a97bb4',
      })
      .expect(200);
  });
});
