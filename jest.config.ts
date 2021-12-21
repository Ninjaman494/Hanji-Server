/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

export default {
  preset: '@shelf/jest-mongodb',
  // Automatically clear mock calls and instances between every test
  clearMocks: true,
  transformIgnorePatterns: [
    '/src/korean/conjugations',
    '/node_modules',
    'conjugator.js',
    'geulja.js',
  ],
  modulePathIgnorePatterns: ['/build'],
  watchPathIgnorePatterns: ['globalConfig'],
};
