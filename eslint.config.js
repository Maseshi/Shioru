const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended')

module.exports = [
  {
    ignores: [
      '.note.txt',
      '.firebase',
      '.firebaserc',
      'firebase.json',
      'database.rules.json',
      'firestore.indexes.json',
      'firestore.rules',
      'storage.rules',
      '.env',
      '.env.local',
      '.env.development.local',
      '.env.test.local',
      '.env.production.local',
      '.cache/',
      'logs',
      '*.log',
      'node_modules/',
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
