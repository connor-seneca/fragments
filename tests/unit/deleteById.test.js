const request = require('supertest');
const app = require('../../src/app');

describe('DELETE /fragment', () => {
  test('DELETE fragment after posting', async () => {
    const pRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('data');

    const id = pRes.body.fragment.id;

    //make sure the fragment was posted correctly
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

    //attempt to delete the fragment
    const dRes = await request(app)
      .delete(`/v1/fragments/${id}`)
      .auth('user1@email.com', 'password1');

    expect(dRes.statusCode).toBe(200);
    expect(dRes.body.status).toBe('ok');

    //attempt to get the fragment we just deleted
    const get = await request(app).get(`/v1/fragments/${id}`).auth('user1@email.com', 'password1');

    expect(get.statusCode).toBe(404);
  });
});
