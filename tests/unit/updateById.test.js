const request = require('supertest');
const app = require('../../src/app');
const { randomUUID } = require('crypto');

describe('PUT /fragments', () => {
  test('authenticated users can update a fragment', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('data');

    const id = res.body.fragment.id;

    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('ok');
    expect(res.body.fragment.size).toEqual(4);
    expect(res.body.fragment.type).toBe('text/plain');

    const updateRes = await request(app)
      .put(`/v1/fragments/${id}`)
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('updated data');

    expect(updateRes.statusCode).toBe(200);
    expect(updateRes.body.status).toBe('ok');
    expect(updateRes.body.fragment.size).toEqual(12);

    const getRes = await request(app)
      .get(`/v1/fragments/${id}`)
      .auth('user1@email.com', 'password1');

    expect(getRes.text).toBe('updated data');
  });

  test('authenticated users cannot update a fragment with new content-type', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('data');

    const id = res.body.fragment.id;

    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('ok');
    expect(res.body.fragment.size).toEqual(4);
    expect(res.body.fragment.type).toBe('text/plain');

    var test = { data: 'data' };
    const updateRes = await request(app)
      .put(`/v1/fragments/${id}`)
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'application/json')
      .send(test);

    expect(updateRes.statusCode).toBe(400);
  });

  test('authenticated users cannot update a fragment that does not exist', async () => {
    const id = randomUUID();

    const updateRes = await request(app)
      .put(`/v1/fragments/${id}`)
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('testing update');

    expect(updateRes.statusCode).toBe(404);
  });
});
