const request = require('supertest');
const app = require('../../src/app');
const hash = require('../../src/hash');
const markdown = require('markdown-it')();

describe('POST /fragments', () => {
  test('authenticated users can post a text/plain fragment', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('data');

    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('ok');
    expect(res.body.fragment.ownerId).toEqual(hash('user1@email.com'));
    expect(res.body.fragment.size).toEqual(4);
    expect(res.body.fragment.id).toBeDefined();
    expect(res.body.fragment.created).toBeDefined();
    expect(res.body.fragment.updated).toBeDefined();
    expect(res.body.fragment.type).toBe('text/plain');
    expect(res.headers['location']).toBe(
      `https://localhost:8080/v1/fragments/${res.body.fragment.id}`
    );
  });

  test('authenticated users can post a text/markdown fragment', async () => {
    var md = markdown.render('#test test');
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/markdown')
      .send(md);

    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('ok');
    expect(res.body.fragment.ownerId).toEqual(hash('user1@email.com'));
    expect(res.body.fragment.size).toEqual(md.length);
    expect(res.body.fragment.id).toBeDefined();
    expect(res.body.fragment.created).toBeDefined();
    expect(res.body.fragment.updated).toBeDefined();
    expect(res.body.fragment.type).toBe('text/markdown');
    expect(res.headers['location']).toBe(
      `https://localhost:8080/v1/fragments/${res.body.fragment.id}`
    );
  });

  test('authenticated users can post a text/html fragment', async () => {
    var html = '<h1>test</h1>';
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/html')
      .send(html);

    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('ok');
    expect(res.body.fragment.ownerId).toEqual(hash('user1@email.com'));
    expect(res.body.fragment.size).toEqual(html.length);
    expect(res.body.fragment.id).toBeDefined();
    expect(res.body.fragment.created).toBeDefined();
    expect(res.body.fragment.updated).toBeDefined();
    expect(res.body.fragment.type).toBe('text/html');
    expect(res.headers['location']).toBe(
      `https://localhost:8080/v1/fragments/${res.body.fragment.id}`
    );
  });

  test('authenticated users can post a application/json fragment', async () => {
    var test = { data: 'data' };
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'application/json')
      .send(test);

    const resBuffer = Buffer.from(JSON.stringify(test));

    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('ok');
    expect(res.body.fragment.ownerId).toEqual(hash('user1@email.com'));
    expect(res.body.fragment.size).toEqual(resBuffer.length);
    expect(res.body.fragment.id).toBeDefined();
    expect(res.body.fragment.created).toBeDefined();
    expect(res.body.fragment.updated).toBeDefined();
    expect(res.body.fragment.type).toBe('application/json');
    expect(res.headers['location']).toBe(
      `https://localhost:8080/v1/fragments/${res.body.fragment.id}`
    );
  });

  test('authenticated users cant post a unsupported type', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'application/msword')
      .send('data');

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
