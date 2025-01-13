const { strict: assert } = require('node:assert');
const mm = require('egg-mock');

describe('test/noopen.test.js', () => {
  let app;
  before(() => {
    app = mm.app({
      baseDir: 'apps/noopen',
      plugin: 'security',
    });
    return app.ready();
  });

  afterEach(mm.restore);

  it('should return default download noopen http header', () => {
    return app.httpRequest()
      .get('/')
      .set('accept', 'text/html')
      .expect('X-Download-Options', 'noopen')
      .expect(200);
  });

  it('should not return download noopen http header', async () => {
    const res = await app.httpRequest()
      .get('/disable')
      .set('accept', 'text/html')
      .expect(200);
    assert.equal(res.headers['x-download-options'], undefined);
  });
});
