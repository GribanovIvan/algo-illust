module.exports = {
  testEnvironment: 'jsdom',
  cacheDirectory: '<rootDir>/.jest-cache',
  testMatch: ['<rootDir>/tests/**/*.test.[jt]s?(x)'],
  transform: { '^.+\\.[jt]sx?$': 'babel-jest' },
  moduleNameMapper: { '\\.(css|scss)$': 'identity-obj-proxy' },
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/*.d.ts'],
  coverageThreshold: { global: { lines: 82.18 } },
  coverageReporters: ['text', 'json-summary', 'lcov'],
  clearMocks: true,
  restoreMocks: true,
};
