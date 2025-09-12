import js from '@eslint/js';

export default [
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
      'no-undef': 'warn',
      'no-console': 'off',
      'prefer-const': 'warn',
      semi: ['error', 'always'],
      quotes: ['error', 'single', { avoidEscape: true }]
    }
  }
];
