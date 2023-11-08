const request = require('supertest');
const app = require('../../src/app');
const logger = require('../../src/logger');

describe('GET /fragments/:id/info', () => {
  test('authenticated users can get fragment info by id', async () => {
    const pRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('data');

    const id = pRes.body.fragment.id;

    logger.info(`fragment id: ${id}`);

    const gRes = await request(app)
      .get(`/v1/fragments/${id}/info`)
      .auth('user1@email.com', 'password1');

    expect(gRes.statusCode).toBe(200);
    expect(gRes.body.status).toBe('ok');
    expect(gRes.body.fragment.id).toBeDefined();
    expect(gRes.body.fragment.type).toBe(pRes.body.fragment.type);
    expect(gRes.body.fragment.size).toBe(4);
    expect(gRes.body.fragment.created).toBeDefined();
    expect(gRes.body.fragment.updated).toBeDefined();
  });
});
