const request = require('supertest');
const app = require('../../src/app');
const logger = require('../../src/logger');
const markdown = require('markdown-it')();
const fs = require('fs');
const path = require('path');

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

  test('authenticated users can convert image to image/jpg', async () => {
    const imagePath = path.join(__dirname, '../../image_png_test.png');
    const imageData = fs.readFileSync(imagePath);
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'image/png')
      .send(imageData);

    const id = res.body.fragment.id;

    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('ok');
    expect(res.body.fragment.size).toEqual(imageData.length);
    expect(res.body.fragment.type).toBe('image/png');
    expect(res.headers['location']).toBe(`http://localhost:8080/v1/fragments/${id}`);

    const conversion = await request(app)
      .get(`/v1/fragments/${id}.jpg`)
      .auth('user1@email.com', 'password1');

    expect(conversion.statusCode).toBe(200);
    expect(conversion.headers['content-type']).toBe('image/jpg');
  });

  test('authenticated users can convert image to image/webp', async () => {
    const imagePath = path.join(__dirname, '../../image_png_test.png');
    const imageData = fs.readFileSync(imagePath);
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'image/png')
      .send(imageData);

    const id = res.body.fragment.id;

    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('ok');
    expect(res.body.fragment.size).toEqual(imageData.length);
    expect(res.body.fragment.type).toBe('image/png');
    expect(res.headers['location']).toBe(`http://localhost:8080/v1/fragments/${id}`);

    const conversion = await request(app)
      .get(`/v1/fragments/${id}.webp`)
      .auth('user1@email.com', 'password1');

    expect(conversion.statusCode).toBe(200);
    expect(conversion.headers['content-type']).toBe('image/webp');
  });

  test('authenticated users can convert image to image/gif', async () => {
    const imagePath = path.join(__dirname, '../../image_png_test.png');
    const imageData = fs.readFileSync(imagePath);
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'image/png')
      .send(imageData);

    const id = res.body.fragment.id;

    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('ok');
    expect(res.body.fragment.size).toEqual(imageData.length);
    expect(res.body.fragment.type).toBe('image/png');
    expect(res.headers['location']).toBe(`http://localhost:8080/v1/fragments/${id}`);

    const conversion = await request(app)
      .get(`/v1/fragments/${id}.gif`)
      .auth('user1@email.com', 'password1');

    expect(conversion.statusCode).toBe(200);
    expect(conversion.headers['content-type']).toBe('image/gif');
  });

  test('authenticated users can convert image to image/png', async () => {
    const imagePath = path.join(__dirname, '../../test_image.jpg');
    const imageData = fs.readFileSync(imagePath);
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'image/jpeg')
      .send(imageData);

    const id = res.body.fragment.id;

    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('ok');
    expect(res.body.fragment.size).toEqual(imageData.length);
    expect(res.body.fragment.type).toBe('image/jpeg');
    expect(res.headers['location']).toBe(`http://localhost:8080/v1/fragments/${id}`);

    const conversion = await request(app)
      .get(`/v1/fragments/${id}.png`)
      .auth('user1@email.com', 'password1');

    expect(conversion.statusCode).toBe(200);
    expect(conversion.headers['content-type']).toBe('image/png');
  });
});
