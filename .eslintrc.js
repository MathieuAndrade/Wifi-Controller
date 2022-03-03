module.exports = {
  env: {
    es2021: true,
  },
  extends: ['airbnb-base', 'prettier'],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    'prettier/prettier': 'error',
    'import/no-extraneous-dependencies': [0],
    'no-unused-vars': [2, { args: 'all', argsIgnorePattern: '^_' }],
  },
  plugins: ['prettier', 'svelte3'],
  overrides: [
    {
      files: ['*.svelte'],
      processor: 'svelte3/svelte3',
    },
  ],
};
