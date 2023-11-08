const request = require('supertest');
const app = require('../../src/app');
const logger = require('../../src/logger');
const markdown = require('markdown-it')();

describe('GET /fragments/:id', () => {
  test('authenticated users can get text/plain fragment by id', async () => {
    const pRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send('data');

    const id = pRes.body.fragment.id;

    logger.info(`fragment id: ${id}`);

    const gRes = await request(app).get(`/v1/fragments/${id}`).auth('user1@email.com', 'password1');
    expect(gRes.statusCode).toBe(200);
    expect(gRes.headers['content-type']).toBe(pRes.body.fragment.type);
    expect(gRes.headers['content-length']).toBe('4');
    expect(gRes.text).toBe('data');
  });

  test('authenticated users can get text/markdown fragment by id', async () => {
    var md = `# Test Markdown`;
    const pRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/markdown')
      .send(md);

    const id = pRes.body.fragment.id;

    logger.info(`fragment id: ${id}`);

    const gRes = await request(app).get(`/v1/fragments/${id}`).auth('user1@email.com', 'password1');
    expect(gRes.statusCode).toBe(200);
    expect(gRes.headers['content-type']).toBe(pRes.body.fragment.type);
    expect(gRes.headers['content-length']).toBe(String(md.length));
    expect(gRes.text).toBe(md);
  });

  test('authenticated users can get text/html fragment by id', async () => {
    var html = '<h1>test</h1>';
    const pRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/html')
      .send(html);

    const id = pRes.body.fragment.id;

    logger.info(`fragment id: ${id}`);

    const gRes = await request(app).get(`/v1/fragments/${id}`).auth('user1@email.com', 'password1');
    expect(gRes.statusCode).toBe(200);
    expect(gRes.headers['content-type']).toBe(pRes.body.fragment.type);
    expect(gRes.headers['content-length']).toBe(String(html.length));
    expect(gRes.text).toBe(html);
  });

  test('authenticated users can get application/json fragment by id', async () => {
    const test = { body: 'data' };
    const pRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'application/json')
      .send(test);

    const resBuffer = Buffer.from(JSON.stringify(test));
    const id = pRes.body.fragment.id;

    logger.info(`fragment id: ${id}`);

    const gRes = await request(app).get(`/v1/fragments/${id}`).auth('user1@email.com', 'password1');
    expect(gRes.statusCode).toBe(200);
    expect(gRes.headers['content-type']).toBe(pRes.body.fragment.type);
    expect(gRes.headers['content-length']).toBe(resBuffer.length.toString());
    expect(gRes.body).toStrictEqual(test);
  });

  test('authenticated users can convert text/markdown to text/html', async () => {
    var md = `# Test Markdown`;
    const pRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/markdown')
      .send(md);

    const id = pRes.body.fragment.id;

    logger.info(`fragment id: ${id}`);

    var html = markdown.render(md);

    const gRes = await request(app)
      .get(`/v1/fragments/${id}.html`)
      .auth('user1@email.com', 'password1');
    expect(gRes.statusCode).toBe(200);
    expect(gRes.headers['content-type']).toBe('text/html; charset=utf-8');
    expect(gRes.headers['content-length']).toBe(String(html.length));
    expect(gRes.text).toBe(html);
  });
});
