import js from '@eslint/js'
import globals from 'globals'
import prettierConfig from 'eslint-config-prettier'

export default [
  // Global ignores
  {
    ignores: ['dist/**', 'node_modules/**'],
  },

  // Base configuration
  js.configs.recommended,

  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.es6,
      },
    },
  },

  // Prettier config (should be last to override conflicting rules)
  prettierConfig,
]
