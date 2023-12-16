module.exports = {
  env: {
    node: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
    tsconfigRootDir: __dirname,
  },
  rules: {
    'arrow-body-style': 'off',
    'no-use-before-define': 'off',
    'global-require': 'off',
    'import/no-extraneous-dependencies': 'off',
  },
};
