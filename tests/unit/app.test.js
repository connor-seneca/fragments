const request = require('supertest');
const app = require('../../src/app');

describe('GET /notfound', () => {
  test('resource cannot be found', () => request(app).get('/notfound').expect(404));
});
