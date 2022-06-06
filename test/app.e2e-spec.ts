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

  describe('authenticate()', () => {
    it('should return an error', () => {
      return request(app.getHttpServer())
        .get('/oauth/user')
        .expect(401);
    });

    it('should authenticate the request', () => {
      return request(app.getHttpServer())
        .get('/oauth/user')
        .set('Authorization', 'Bearer foobar')
        .expect(200);
    });
  });

  describe('authorize()', () => {
    it('should return an error', () => {
      return request(app.getHttpServer())
        .post('/oauth/authorize?state=foobiz')
        .set('Authorization', 'Bearer foobar')
        .send({ client_id: '12345' })
        .expect(400)
        .expect({ error: 'invalid_request', error_description: 'Missing parameter: `response_type`' });
    });

    it('should return a `location` header with the code', () => {
      return request(app.getHttpServer())
        .post('/oauth/authorize?state=foobiz')
        .set('Authorization', 'Bearer foobar')
        .send({ client_id: '12345', response_type: 'code' })
        .expect(302)
        .expect('Location', 'http://example.com/?code=123&state=foobiz');
    });
  });

  describe('token()', () => {
    it('should return an error', () => {
      return request(app.getHttpServer())
        .post('/oauth/token')
        .set({ 'Content-Type': 'application/x-www-form-urlencoded', Authorization: 'Basic qazwsx' })
        .send({ client_id: '12345', secret: 'secret', grant_type: 'authorization_code', code: '123' })
        .expect(400)
        .expect({ error: 'invalid_client', error_description: 'Invalid client: cannot retrieve client credentials' });
    });

    it('should return an `access_token`', () => {
      return request(app.getHttpServer())
        .post('/oauth/token')
        .set({ 'Content-Type': 'application/x-www-form-urlencoded', Authorization: 'Basic MTIzNDU6c2VjcmV0' }) // Basic base64(12345:secret)
        .send({ client_id: '12345', secret: 'secret', grant_type: 'authorization_code', code: '123' })
        .expect(200)
        .expect({ access_token: 'foobar', token_type: 'Bearer' });
    });
  });
});
