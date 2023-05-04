module.exports = {
  env: {
    es6: true,
    browser: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: '2015',
    sourceType: 'module',
  },
  rules: {
    // 'no-undef': 'error',
    // quotes: ['error', 'double'],
  },
  extends: ['eslint:recommended'],
};