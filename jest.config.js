module.exports = {
  // This is require because of an issue with jest configuration
  testURL: 'http://localhost',
  setupTestFrameworkScriptFile: '<rootDir>/build/jest.setup.ts',
  transform: {
    ".(ts)": "ts-jest"
  },
  testMatch: [
    "**/*.spec.ts"
  ],
  moduleFileExtensions: [
    "ts",
    "js",
    "json"
  ],
  testPathIgnorePatterns: [
    "\\/node_modules",
    "\\/dist",
    "\\/build",
    "\\/src\\/.*\\.{js}"
  ],
  testResultsProcessor: 'jest-sonar-reporter',
  collectCoverageFrom: [
    'src/**/*.{ts}',
    'src/**/*.{js}',
    '!src/entry.ts',
    '!src/configuration/targets.config.ts',
    '!dist/**',
    '!build/**',
    '!**/node_modules/**',
  ]
};
