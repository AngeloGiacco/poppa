module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node', // Important for API route testing
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    // Handle module aliases (if you have them in tsconfig.json)
    '^@/components/(.*)$': '<rootDir>/src/components/$1',
    '^@/lib/(.*)$': '<rootDir>/src/lib/$1',
    '^@/context/(.*)$': '<rootDir>/src/context/$1',
    '^@/pages/(.*)$': '<rootDir>/src/pages/$1',
    // Mock CSS Modules (if you use them, though less relevant for API tests)
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  transform: {
    // Use ts-jest for .ts and .tsx files
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: 'tsconfig.json', // Or your specific tsconfig for tests if you have one
    }],
  },
  // Collect coverage from src directory, excluding specific files/folders
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/_app.tsx', // Exclude Next.js specific files if not testing them
    '!src/**/_document.tsx',
    '!src/pages/api/auth/[...nextauth].ts', // Example: Exclude NextAuth.js route if complex/external
  ],
  coverageDirectory: 'coverage',
  // Automatically clear mock calls and instances between every test
  clearMocks: true,
};
