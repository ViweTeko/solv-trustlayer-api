module.exports = {
    // Specify the environment where your code runs
    env: {
      browser: true,
      es2020: true,
      node: true,
    },
    // Extend recommended configurations for best practices
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:react/recommended',
      'plugin:react-hooks/recommended',
    ],
    // Parser and parsing options
    parser: '@typescript-eslint/parser',
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
      ecmaVersion: 11,
      sourceType: 'module',
    },
    // Plugins used in the configuration
    plugins: [
      'react',
      '@typescript-eslint',
      'react-hooks',
    ],
    // Custom rules configuration
    rules: {
      // ----------------------------------------------------
      // FORMATTING RULE: Enforce 80 characters max line length
      // Setting this to 'error' ensures the violation is displayed
      // as an error you must manually fix.
      // [2, 80, { ignoreUrls: true, ignoreComments: false }]
      // 2: error level
      // 80: max characters
      // ----------------------------------------------------
      'max-len': ['error', { 
        code: 80, 
        ignoreUrls: true, 
        ignoreComments: true,
        ignoreRegExpLiterals: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
      }],
      
      // Disable common style conflicts since we're manually 
      // managing 'max-len' via ESLint
      'indent': 'off', 
      'quotes': 'off',
      'semi': 'off',
  
      // TypeScript best practices (Recommended)
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
  
      // React specific rules
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
    },
    // Settings for React plugin
    settings: {
      react: {
        version: 'detect',
      },
    },
  };