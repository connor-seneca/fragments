const request = require('supertest');
const app = require('../../src/app');
const logger = require('../../src/logger');
const markdown = require('markdown-it')();

describe('GET /fragments/:id.ext', () => {
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
