/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

export default {
  // Automatically clear mock calls and instances between every test
  clearMocks: true,
  transformIgnorePatterns: [
    '/src/korean/conjugations',
    '/src/korean/conjugator.js',
    '/src/korean/hangeul.js',
    '/node_modules',
  ],
  modulePathIgnorePatterns: ['/build'],
};
