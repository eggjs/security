const { strict: assert } = require('node:assert');
const mm = require('egg-mock');

describe('test/context.test.js', () => {
  afterEach(mm.restore);
  describe('context.isSafeDomain', () => {
    let app;
    before(() => {
      app = mm.app({
        baseDir: 'apps/isSafeDomain-custom',
      });
      return app.ready();
    });

    it('should return false when domains are not safe', async () => {
      const res = await app.httpRequest()
        .get('/unsafe')
        .set('accept', 'text/html')
        .expect(200);
      assert(res.text === 'false');
    });

    it('should return true when domains are safe', async () => {
      const res = await app.httpRequest()
        .get('/safe')
        .set('accept', 'text/html')
        .expect(200);
      assert(res.text === 'true');
    });
  });
});
