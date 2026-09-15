// CSS modules: styles.foo === 'foo'
module.exports = new Proxy({}, {
  get: (_, key) => (key === '__esModule' ? false : key),
});
