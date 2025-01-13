const { strict: assert } = require('node:assert');
const mm = require('egg-mock');
const { utils } = require('..');

describe('test/utils.test.js', () => {
  afterEach(mm.restore);
  describe('utils.isSafeDomain', () => {
    let app;
    before(() => {
      app = mm.app({
        baseDir: 'apps/isSafeDomain',
      });
      return app.ready();
    });
    const domainWhiteList = [ '.domain.com', '*.alibaba.com', 'http://www.baidu.com', '192.*.0.*', 'foo.bar' ];
    it('should return false when domains are not safe', async () => {
      const res = await app.httpRequest()
        .get('/')
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

    it('should return true', () => {
      assert(utils.isSafeDomain('domain.com', domainWhiteList) === true);
      assert(utils.isSafeDomain('.domain.com', domainWhiteList) === true);
      assert(utils.isSafeDomain('foo.domain.com', domainWhiteList) === true);
      assert(utils.isSafeDomain('.foo.domain.com', domainWhiteList) === true);
      assert(utils.isSafeDomain('.....domain.com', domainWhiteList) === true);
      assert(utils.isSafeDomain('okokok----.domain.com', domainWhiteList) === true);

      // Wild Cast check
      assert(utils.isSafeDomain('www.alibaba.com', domainWhiteList) === true);
      assert(utils.isSafeDomain('www.tianmao.alibaba.com', domainWhiteList) === true);
      assert(utils.isSafeDomain('www.tianmao.AlIBAba.COm', domainWhiteList) === true);
      assert(utils.isSafeDomain('http://www.baidu.com', domainWhiteList) === true);
      assert(utils.isSafeDomain('192.168.0.255', domainWhiteList) === true);
      assert(utils.isSafeDomain('foo.bar', domainWhiteList) === true);
    });

    it('should return false', () => {
      assert(utils.isSafeDomain('', domainWhiteList) === false);
      assert(utils.isSafeDomain(undefined, domainWhiteList) === false);
      assert(utils.isSafeDomain(null, domainWhiteList) === false);
      assert(utils.isSafeDomain(0, domainWhiteList) === false);
      assert(utils.isSafeDomain(1, domainWhiteList) === false);
      assert(utils.isSafeDomain({}, domainWhiteList) === false);
      assert(utils.isSafeDomain(function() {}, domainWhiteList) === false);
      assert(utils.isSafeDomain('aaa-domain.com', domainWhiteList) === false);
      assert(utils.isSafeDomain(' domain.com', domainWhiteList) === false);
      assert(utils.isSafeDomain('pwd---.-domain.com', domainWhiteList) === false);
      assert(utils.isSafeDomain('ok. domain.com', domainWhiteList) === false);

      // Wild Cast check
      assert(utils.isSafeDomain('www.alibaba.com.cn', domainWhiteList) === false);
      assert(utils.isSafeDomain('www.tianmao.alibab.com', domainWhiteList) === false);
      assert(utils.isSafeDomain('http://www.baidu.com/zh-CN', domainWhiteList) === false);
      assert(utils.isSafeDomain('192.168.1.255', domainWhiteList) === false);
      assert(utils.isSafeDomain('foofoo.bar', domainWhiteList) === false);
    });
  });

  describe('utils.checkIfIgnore', () => {
    let app,
      app2,
      app3,
      app4,
      app5,
      app6;
    before(async () => {
      app = mm.app({
        baseDir: 'apps/utils-check-if-pass',
        plugin: 'security',
      });
      await app.ready();

      app2 = mm.app({
        baseDir: 'apps/utils-check-if-pass2',
        plugin: 'security',
      });
      await app2.ready();

      app3 = mm.app({
        baseDir: 'apps/utils-check-if-pass3',
        plugin: 'security',
      });
      await app3.ready();

      app4 = mm.app({
        baseDir: 'apps/utils-check-if-pass4',
        plugin: 'security',
      });
      await app4.ready();

      app5 = mm.app({
        baseDir: 'apps/utils-check-if-pass5',
        plugin: 'security',
      });
      await app5.ready();

      app6 = mm.app({
        baseDir: 'apps/utils-check-if-pass6',
        plugin: 'security',
      });
      await app6.ready();
    });

    it('should use match', async () => {
      const res = await app.httpRequest()
        .get('/match')
        .expect(200);
      assert(res.headers['x-csp-nonce'].length === 16);
    });

    it('global match should not work', async () => {
      const res = await app.httpRequest()
        .get('/luckydrq')
        .expect(200);
      assert(res.headers['x-csp-nonce'].length === 16);
    });

    it('own match should replace global match', async () => {
      let res = await app2.httpRequest()
        .get('/mymatch')
        .expect(200);
      assert(res.headers['x-csp-nonce'].length === 16);
      res = await app2.httpRequest()
        .get('/match')
        .expect(200);
      assert(!res.headers['x-csp-nonce']);
    });

    it('own match has priority over own ignore', async () => {
      const res = await app2.httpRequest()
        .get('/mytrueignore')
        .expect(200);
      assert(!res.headers['x-csp-nonce']);
    });

    it('should not use global ignore', async () => {
      const res = await app3.httpRequest()
        .get('/ignore')
        .expect(200);
      assert(res.headers['x-csp-nonce'].length === 16);
    });

    it('own ignore should replace global ignore', async () => {
      let res = await app4.httpRequest()
        .get('/ignore')
        .expect(200);
      assert(res.headers['x-csp-nonce'].length === 16);
      res = await app4.httpRequest()
        .get('/myignore')
        .expect(200);
      assert(!res.headers['x-csp-nonce']);
    });

    it('should ignore array work', async () => {
      let res = await app5.httpRequest()
        .get('/ignore1')
        .expect(200);
      assert(!res.headers['x-frame-options']);

      res = await app5.httpRequest()
        .get('/ignore2')
        .expect(200);
      assert(!res.headers['x-frame-options']);

      res = await app5.httpRequest()
        .get('/')
        .expect(200);
      assert(res.header['x-frame-options']);
    });

    it('should match array work', async () => {
      let res = await app6.httpRequest()
        .get('/match1')
        .expect(200);
      assert(res.headers['x-frame-options']);

      res = await app6.httpRequest()
        .get('/match2')
        .expect(200);
      assert(res.headers['x-frame-options']);

      res = await app6.httpRequest()
        .get('/')
        .expect(200);
      assert(!res.headers['x-frame-options']);
    });
  });

  describe('utils.checkInvalidHeaderChar', function() {
    it('Invalid character return true', function() {
      utils.checkInvalidHeaderChar('aaaaa\naaaaaa').should.equal(true);
      utils.checkInvalidHeaderChar('aaaa\raaaaa').should.equal(true);
    });

    it('character return false', function() {
      utils.checkInvalidHeaderChar('aaaaa').should.equal(false);
      utils.checkInvalidHeaderChar('aaaa aaaaa').should.equal(false);
      utils.checkInvalidHeaderChar('aaaaaaaaa').should.equal(false);
    });
  });
});
