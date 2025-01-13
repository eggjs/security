const { strict: assert } = require('node:assert');
const mm = require('egg-mock');

describe('test/nosniff.test.js', function() {

  describe('server', function() {
    before(function(done) {
      this.app = mm.app({
        baseDir: 'apps/nosniff',
        plugin: 'security',
      });
      this.app.ready(done);
    });

    afterEach(mm.restore);

    it('should return default no-sniff http header', function(done) {
      this.app.httpRequest()
        .get('/')
        .set('accept', 'text/html')
        .expect('X-Content-Type-Options', 'nosniff')
        .expect(200, done);
    });

    it('should not return download noopen http header', function(done) {
      this.app.httpRequest()
        .get('/disable')
        .set('accept', 'text/html')
        .expect(res => assert(!res.headers['x-content-type-options']))
        .expect(200, done);
    });

    it('should disable nosniff on redirect 302', function() {
      return this.app.httpRequest()
        .get('/redirect')
        .expect(res => assert(!res.headers['x-content-type-options']))
        .expect('location', '/')
        .expect(302);
    });

    it('should disable nosniff on redirect 301', function() {
      return this.app.httpRequest()
        .get('/redirect301')
        .expect(res => assert(!res.headers['x-content-type-options']))
        .expect('location', '/')
        .expect(301);
    });

    it('should disable nosniff on redirect 307', function() {
      return this.app.httpRequest()
        .get('/redirect307')
        .expect(res => assert(!res.headers['x-content-type-options']))
        .expect('location', '/')
        .expect(307);
    });
  });
});
