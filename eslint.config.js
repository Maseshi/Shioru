const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended')

module.exports = [
  {
    ignores: [
      'assets/',
      'logs/',
      'node_modules/',
      '*.log',
      '.env',
      '.env.local',
      '.env.development.local',
      '.env.test.local',
      '.env.production.local',
      'package-lock.json',
      'LICENSE',
      'LICENSE_ASSETS',
      'NOTE.md',
    ],
    languageOptions: {
      globals: {
        node: true,
        es6: true,
      },
      ecmaVersion: 'latest',
    },
  },
  eslintPluginPrettierRecommended,
]
