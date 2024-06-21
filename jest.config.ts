import { type Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  dir: './',
});

const jestConfig: Config = {
  testEnvironment: 'node',
  globalSetup: '<rootDir>/jest/setup.js',
  globalTeardown: '<rootDir>/jest/teardown.js',
  testTimeout: 30000,
};

export default createJestConfig(jestConfig);
