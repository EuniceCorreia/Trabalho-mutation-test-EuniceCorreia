/** @type {import('@stryker-mutator/api/core').PartialStrykerOptions} */
module.exports = {
  mutate: ['src/**/*.js'],
  testRunner: 'jest',
  jest: {
    projectType: 'custom',
    config: {
      testEnvironment: 'node',
    },
  },
  reporters: ['clear-text', 'progress', 'html'],
  htmlReporter: {
    fileName: 'reports/stryker/index.html',
  },
  coverageAnalysis: 'perTest',
  thresholds: {
    high: 80,
    low: 60,
    break: null,
  },
};
