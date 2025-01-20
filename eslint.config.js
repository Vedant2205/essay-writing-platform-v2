import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import next from 'eslint-plugin-next'; // Import Next.js plugin

export default [
  { ignores: ['dist'] }, // Ignore build files
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    settings: { react: { version: '18.3' } }, // Adjust React version if needed
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      next, // Add Next.js plugin
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      ...next.configs.recommended.rules, // Next.js rules
      'react/jsx-no-target-blank': 'off', // Example rule customization
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'react/prop-types': 'off', // Disable prop-types globally
    },
  },
];
