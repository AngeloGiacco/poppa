# Testing Guide

This document describes the testing strategy, patterns, and best practices for the Poppa codebase.

## Table of Contents

- [Overview](#overview)
- [Test Stack](#test-stack)
- [Running Tests](#running-tests)
- [Test Organization](#test-organization)
- [Writing Tests](#writing-tests)
- [Mocking Patterns](#mocking-patterns)
- [Coverage Goals](#coverage-goals)

## Overview

Poppa uses Jest as the primary testing framework with a focus on:

1. **API Route Tests** - Testing webhook handlers and server-side logic
2. **Utility Tests** - Testing pure functions and business logic
3. **Integration Tests** - Testing component interactions (planned)

## Test Stack

| Tool | Purpose |
|------|---------|
| Jest | Test runner and assertion library |
| ts-jest | TypeScript support for Jest |
| node-mocks-http | Mocking Next.js API requests/responses |
| supertest | HTTP assertions (optional) |
| @testing-library/react | Component testing (for future use) |

## Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode (development)
pnpm test:watch

# Run tests with coverage report
pnpm test:coverage

# Run tests in CI mode (no watch, with coverage)
pnpm test:ci

# Run specific test file
pnpm test -- src/pages/api/stripe/__tests__/webhooks.test.ts

# Run tests matching a pattern
pnpm test -- --testNamePattern="webhook"
```

## Test Organization

```
poppa_frontend/
├── jest.config.js          # Jest configuration
├── jest.setup.js           # Global mocks and setup
├── src/
│   ├── lib/
│   │   └── __tests__/      # Utility function tests
│   │       ├── lesson-utils.test.ts
│   │       └── supportedLanguages.test.ts
│   ├── pages/
│   │   └── api/
│   │       ├── stripe/
│   │       │   └── __tests__/
│   │       │       ├── checkout-session.test.ts
│   │       │       ├── customer-portal.test.ts
│   │       │       └── webhooks.test.ts
│   │       └── elevenlabs/
│   │           └── __tests__/
│   │               └── webhooks.test.ts
│   └── components/
│       └── __tests__/      # Component tests (future)
```

### Naming Conventions

- Test files: `*.test.ts` or `*.test.tsx`
- Test directories: `__tests__/` adjacent to the code being tested
- Test descriptions: Use clear, behavior-focused descriptions

```typescript
describe('ElevenLabs Webhook Handler', () => {
  describe('Signature Verification', () => {
    it('should return 400 if signature is missing', () => {
      // test
    });
  });
});
```

## Writing Tests

### API Route Tests

API route tests verify request handling, validation, and response formatting.

```typescript
import { createMocks } from 'node-mocks-http';
import type { NextApiRequest, NextApiResponse } from 'next';
import handler from '../handler';

describe('/api/example', () => {
  it('should handle POST requests', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
      body: { data: 'test' },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual({ success: true });
  });

  it('should reject non-POST methods', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(405);
  });
});
```

### Utility Function Tests

Pure function tests should cover edge cases and expected behavior.

```typescript
import { generateThinkingMethodInstruction } from '../lesson-utils';

describe('generateThinkingMethodInstruction', () => {
  it('should generate instruction for Spanish learner', () => {
    const result = generateThinkingMethodInstruction('Spanish', 'English');

    expect(result).toContain('Spanish');
    expect(result).toContain('English');
    expect(result).toContain('socratic method');
  });

  it('should include core teaching principles', () => {
    const result = generateThinkingMethodInstruction('French', 'English');

    expect(result).toContain('Never directly explain grammar rules');
    expect(result).toContain('Never ask students to memorize');
  });
});
```

### Test Structure (AAA Pattern)

Follow the Arrange-Act-Assert pattern:

```typescript
it('should increment user usage on call_ended event', async () => {
  // Arrange
  const eventPayload = {
    type: 'call_ended',
    data: { user_id: 'user_123' },
  };
  mockSupabase.rpc.mockResolvedValue({ data: [{ usage_count: 1 }] });

  // Act
  await handler(req, res);

  // Assert
  expect(mockSupabase.rpc).toHaveBeenCalledWith('increment_user_usage', {
    p_user_id: 'user_123',
    p_increment_by: 1,
  });
  expect(res._getStatusCode()).toBe(200);
});
```

## Mocking Patterns

### Global Mocks (jest.setup.js)

These mocks are available in all tests:

```typescript
// Supabase client
jest.mock('./src/lib/supabase', () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    // ... other methods
  },
}));

// Stripe SDK
jest.mock('stripe', () => {
  return jest.fn(() => ({
    checkout: { sessions: { create: jest.fn() } },
    webhooks: { constructEvent: jest.fn() },
  }));
});
```

### Per-Test Mocks

Override global mocks for specific tests:

```typescript
beforeEach(() => {
  jest.clearAllMocks();
  // Reset to default behavior
  (supabaseClient.rpc as jest.Mock).mockResolvedValue({
    data: [{ usage_count: 1 }],
    error: null,
  });
});

it('should handle database error', async () => {
  // Override for this test
  (supabaseClient.rpc as jest.Mock).mockResolvedValueOnce({
    data: null,
    error: { message: 'Database error' },
  });

  await handler(req, res);

  expect(res._getStatusCode()).toBe(500);
});
```

### Mocking Environment Variables

```typescript
// In jest.setup.js
process.env.STRIPE_SECRET_KEY = 'sk_test_mock';
process.env.ELEVENLABS_WEBHOOK_SECRET = 'el_whsec_mock';

// In tests, temporarily change
it('should error when secret is missing', () => {
  const original = process.env.STRIPE_SECRET_KEY;
  delete process.env.STRIPE_SECRET_KEY;

  // ... test ...

  process.env.STRIPE_SECRET_KEY = original;
});
```

### Mocking Console Output

```typescript
it('should log warning on usage limit exceeded', async () => {
  const warnSpy = jest.spyOn(console, 'warn').mockImplementation();

  await handler(req, res);

  expect(warnSpy).toHaveBeenCalledWith(
    expect.stringContaining('Usage limit exceeded')
  );
  warnSpy.mockRestore();
});
```

## Coverage Goals

### Current Coverage

| Area | Status | Notes |
|------|--------|-------|
| Stripe Webhooks | ✅ Tested | Full coverage of payment events |
| ElevenLabs Webhooks | ✅ Tested | Signature verification, usage tracking |
| Utility Functions | ⚠️ Partial | lesson-utils, supportedLanguages |
| Components | ❌ Not tested | Future work |

### Target Coverage Thresholds

```javascript
// jest.config.js (future)
coverageThreshold: {
  global: {
    branches: 70,
    functions: 70,
    lines: 70,
    statements: 70,
  },
  './src/pages/api/': {
    branches: 80,
    functions: 80,
    lines: 80,
  },
}
```

### Priority Testing Areas

1. **Critical Path** - Webhook handlers (payments, usage tracking)
2. **Business Logic** - Lesson generation, curriculum selection
3. **Data Integrity** - Database operations, user state management
4. **Security** - Signature verification, authentication checks

## Best Practices

### DO

- ✅ Test behavior, not implementation
- ✅ Use descriptive test names that explain the scenario
- ✅ Clear mocks between tests (`jest.clearAllMocks()`)
- ✅ Test error cases and edge conditions
- ✅ Keep tests focused and independent

### DON'T

- ❌ Test third-party library internals
- ❌ Create complex test fixtures (keep data inline)
- ❌ Mock too much (if mocking everything, integration test may be better)
- ❌ Rely on test execution order
- ❌ Skip tests without a tracking issue

## Debugging Tests

### Verbose Output

```bash
pnpm test -- --verbose
```

### Single Test

```bash
pnpm test -- --testNamePattern="specific test name"
```

### Debug Mode

```bash
node --inspect-brk node_modules/.bin/jest --runInBand
```

Then attach VS Code debugger or open `chrome://inspect`.

## Future Improvements

1. **Component Testing** - Add React Testing Library tests for UI components
2. **E2E Testing** - Add Playwright tests for critical user flows
3. **Coverage Enforcement** - Add coverage thresholds to CI
4. **Visual Regression** - Screenshot testing for UI changes
5. **Performance Testing** - Benchmark lesson generation
