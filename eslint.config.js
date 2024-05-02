const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended')

module.exports = [
  {
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
