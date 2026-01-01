# Contributing to Poppa

Thank you for your interest in contributing to Poppa! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Development Workflow](#development-workflow)
- [Code Standards](#code-standards)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)
- [Voice-Only Philosophy](#voice-only-philosophy)

## Code of Conduct

Be respectful, inclusive, and constructive. We're all here to build something great for language learners.

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 9.6.0 (specified in `packageManager`)
- Git

### Fork and Clone

```bash
# Fork the repository on GitHub, then clone your fork
git clone https://github.com/YOUR_USERNAME/poppa.git
cd poppa
```

## Development Setup

```bash
# Navigate to the frontend directory
cd poppa_frontend

# Install dependencies
pnpm install

# Copy environment variables (fill in your own values)
cp .env.example .env.local

# Run the development server
pnpm dev
```

### Environment Variables

See the main [CLAUDE.md](./CLAUDE.md#environment-variables) for required environment variables.

## Development Workflow

### Branch Naming

Use descriptive branch names:
- `feature/add-lesson-progress-tracking`
- `fix/audio-visualizer-mobile`
- `docs/update-api-documentation`
- `refactor/lesson-generation-pipeline`

### Making Changes

1. Create a new branch from `main`
2. Make your changes
3. Ensure all checks pass locally
4. Commit with clear, descriptive messages
5. Push and open a Pull Request

### Pre-commit Checks

Husky runs these checks automatically before each commit:
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Type checking

You can run these manually:

```bash
pnpm lint        # Run ESLint
pnpm format:check # Check formatting
pnpm typecheck   # Run TypeScript type checking
pnpm test        # Run tests
```

## Code Standards

### Critical Rules

These rules are non-negotiable. See [CLAUDE.md](./CLAUDE.md#critical-rules) for details.

1. **"use client" directive** - All components using hooks must have this at the top
2. **Path alias imports** - Always use `@/*` instead of relative imports
3. **Correct Supabase client** - Use `supabase-browser.ts` in client components
4. **Typed database queries** - Use generated `Database` types
5. **Context pattern** - Use proper null checks in context hooks
6. **Translations** - Use `next-intl` for all user-facing text
7. **No AI slop comments** - Don't add obvious/redundant comments

### TypeScript

- Enable `strict` mode
- Prefer explicit types over `any`
- Use `unknown` over `any` when type is truly unknown

### Component Structure

```typescript
"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

interface Props {
  // Explicit prop types
}

export function ComponentName({ ...props }: Props) {
  const t = useTranslations("ComponentName");

  // Component logic

  return (
    // JSX
  );
}
```

## Testing

See [TESTING.md](./TESTING.md) for comprehensive testing guidelines.

### Running Tests

```bash
pnpm test           # Run all tests
pnpm test:watch     # Watch mode
pnpm test:coverage  # With coverage report
```

### Test Organization

- API route tests: `src/pages/api/**/__tests__/`
- Utility tests: `src/lib/__tests__/`
- Component tests: `src/components/__tests__/`

## Pull Request Process

### Before Opening a PR

- [ ] All checks pass locally (`pnpm lint && pnpm format:check && pnpm typecheck && pnpm test`)
- [ ] Code follows the project's coding standards
- [ ] Tests are added for new functionality
- [ ] Documentation is updated if needed
- [ ] Commit messages are clear and descriptive

### PR Description

Use the [PR template](.github/PULL_REQUEST_TEMPLATE.md) which includes:
- Summary of changes
- Related issue (if any)
- Type of change
- Testing done
- Screenshots (for UI changes)

### Review Process

1. Automated checks must pass
2. At least one maintainer review required
3. Address all review feedback
4. Squash and merge when approved

## Voice-Only Philosophy

Poppa is a **voice-only** language learning platform. This is a core design principle that must be respected in all contributions.

### What This Means

| DO | DON'T |
|----|-------|
| Voice-activated controls | Text input for learning |
| Audio visualizers | Written exercises |
| Spoken feedback | On-screen vocabulary lists |
| Minimal UI | Complex text-heavy interfaces |

### Why Voice-Only?

1. **Natural immersion** - Speaking activates deeper language processing
2. **No crutches** - Students can't rely on text
3. **Real conversation skills** - Actual speaking ability from day one
4. **True to method** - Language Transfer's original courses are audio-only

**If your contribution adds text-based learning features, it will not be accepted.**

## Getting Help

- Check existing [issues](https://github.com/AngeloGiacco/poppa/issues)
- Read the [CLAUDE.md](./CLAUDE.md) documentation
- Open a new issue for bugs or feature requests

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
