const globals = Object.fromEntries(
  [
    'AbortController',
    'Array',
    'Buffer',
    'Date',
    'Error',
    'Intl',
    'JSON',
    'Math',
    'Object',
    'Promise',
    'RegExp',
    'String',
    'console',
    'confirm',
    'crypto',
    'document',
    'fetch',
    'process',
    'setTimeout',
    'clearTimeout',
    'localStorage',
    'undefined',
  ].map((name) => [name, 'readonly']),
);

export default [
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals,
    },
    rules: {
      'no-undef': 'error',
      'no-unreachable': 'error',
    },
  },
];
