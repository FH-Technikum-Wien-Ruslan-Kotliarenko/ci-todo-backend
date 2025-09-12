import js from '@eslint/js';

export default [
  // Default (Node CJS) rules for your backend & tests
  {
    files: ['**/*.js'],
    ignores: ['node_modules/**', 'coverage/**', 'dist/**'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'commonjs'
    },
    rules: {
      ...js.configs.recommended.rules,
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-console': 'off',
      'no-undef': 'warn',
      'prefer-const': 'warn',
      semi: ['error', 'always'],
      quotes: ['error', 'single', { avoidEscape: true }]
    }
  },

  // k6 scripts are ES modules
  {
    files: ['k6/**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module'
    }
    // (inherits the rules above)
  }
];
