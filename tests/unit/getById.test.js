const request = require('supertest');
const app = require('../../src/app');
const logger = require('../../src/logger');

describe('GET /fragments/:id', () => {
  test('authenticated users can get a fragment by id', async () => {
    const pRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('data');

    const id = pRes.body.fragment.id;

    logger.info(`fragment id: ${id}`);
    const gRes = await request(app).get(`/v1/fragments/${id}`).auth('user1@email.com', 'password1');
    expect(gRes.statusCode).toBe(200);
    expect(gRes.body.status).toBe('ok');
  });
});
