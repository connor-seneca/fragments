const request = require('supertest');
const app = require('../../src/app');
const logger = require('../../src/logger');
//const { Hash } = require('crypto');

describe('POST /fragments', () => {
  test('authenticated users can post a text/plain fragment', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('data');

    logger.debug(res.body);
    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('ok');
    expect(res.body.fragment.ownerId).toEqual('user1@email.com');
    expect(res.body.fragment.size).toEqual(4);
    expect(res.body.fragment.id).toBeDefined();
    expect(res.body.fragment.created).toBeDefined();
    expect(res.body.fragment.updated).toBeDefined();
    expect(res.headers['location']).toBe(
      `http://localhost:8080/v1/fragments/${res.body.fragment.id}`
    );
  });
  test('authenticated users cant post a unsupported type', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'application/msword')
      .send('data');

    logger.debug(res.body);
    expect(res.statusCode).toBe(415);
    expect(res.body.status).toBe('error');
  });
  test('unauthorized users cant access post route', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('baduser@email.com', 'badpassword')
      .set('Content-Type', 'text/plain')
      .send('data');

    expect(res.statusCode).toBe(401);
  });
});
