import '@testing-library/jest-dom';
module.exports = {
  collectCoverage: true,
  preset: 'ts-jest',

  collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}'],
  coverageDirectory: 'coverage',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
};
