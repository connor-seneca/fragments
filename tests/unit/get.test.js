const request = require('supertest');
const app = require('../../src/app');
const logger = require('../../src/logger');
const hash = require('../../src/hash');

describe('GET /v1/fragments', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () => request(app).get('/v1/fragments').expect(401));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app).get('/v1/fragments').auth('invalid@email.com', 'incorrect_password').expect(401));

  // Using a valid username/password pair should give a success result with a .fragments array
  test('authenticated users get a fragments array', async () => {
    const res = await request(app).get('/v1/fragments').auth('user1@email.com', 'password1');
    logger.info(`fragments: ${res.body.fragments}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(Array.isArray(res.body.fragments)).toBe(true);
  });

  test('returning an expanded list of fragments', async () => {
    //test data creation
    const postReqOne = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('data');
    const postReqTwo = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('another piece of data');

    //make sure test data creation is good
    expect(postReqOne.statusCode).toBe(201);
    expect(postReqTwo.statusCode).toBe(201);

    const res = await request(app)
      .get('/v1/fragments/?expand=1')
      .auth('user1@email.com', 'password1');

    logger.debug('expanded results: ', res.body);
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(Array.isArray(res.body.fragments)).toBe(true);
    expect(res.body.fragments[0].size).toEqual(4);
    expect(res.body.fragments[1].size).toEqual(21);
    expect(res.body.fragments[0].ownerId).toEqual(hash('user1@email.com'));
    expect(res.body.fragments[1].ownerId).toEqual(hash('user1@email.com'));
    expect(res.body.fragments[0].id).toBeDefined();
    expect(res.body.fragments[1].id).toBeDefined();
    expect(res.body.fragments[0].created).toBeDefined();
    expect(res.body.fragments[1].created).toBeDefined();
    expect(res.body.fragments[0].updated).toBeDefined();
    expect(res.body.fragments[1].updated).toBeDefined();
  });
});
