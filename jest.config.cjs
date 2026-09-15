/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  testMatch: ['**/*.test.{ts,tsx}'],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: { jsx: 'react-jsx', module: 'commonjs' } }],
  },
  moduleNameMapper: {
    '\\.(css|scss)$': '<rootDir>/jest/styleMock.cjs',
    '\\?worker$': '<rootDir>/jest/workerMock.cjs',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.test.{ts,tsx}',
    '!src/__fixtures__/**',
    '!src/setupTests.ts',
    '!src/**/*.d.ts',
  ],
  coverageReporters: ['text', 'text-summary'],
};
