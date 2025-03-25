# Icon System Tests

This directory contains comprehensive tests for the Icon system components and utilities.

## Running the Tests

To run all icon-related tests, use the following command from the project root:

```bash
npm run test:icons
# or
yarn test:icons
```

This will execute all tests in the `src/components/icons/__tests__` directory with coverage reporting.

## Test Files

The test suite includes the following files:

1. **FAIcon.test.js**: Tests for the FontAwesome icon compatibility component
2. **Icon.snapshot.test.js**: Snapshot tests for the main Icon component
3. **IconIntegration.test.js**: Integration tests for components using icons
4. **IconStyles.test.js**: Tests for styling functionality
5. **iconMappings.test.js**: Tests for icon mapping utilities
6. **migrate-icons.test.js**: Tests for icon migration functionality
7. **setupIconTests.js**: Common test setup and mock implementations

## Common Test Issues and Solutions

### 1. Missing React Imports

If you encounter errors related to React elements or JSX, ensure that all test files and mocks properly import React:

```javascript
import React from 'react';
```

### 2. Jest Mock Hoisting Issues

Jest mocks must be defined at the top of the file due to hoisting. If you see "Cannot mock module that is not a function" errors, make sure your mocks are defined before any imports:

```javascript
// ✅ Correct
jest.mock('@phosphor-icons/react', () => ({
  Heart: () => <svg data-testid="heart-icon" />
}));
import { Heart } from '@phosphor-icons/react';

// ❌ Incorrect
import { Heart } from '@phosphor-icons/react';
jest.mock('@phosphor-icons/react', () => ({
  Heart: () => <svg data-testid="heart-icon" />
}));
```

### 3. Snapshot Test Failures

If snapshot tests are failing, there may have been intentional changes to the components. Review the diff carefully and if the changes are expected, update the snapshots with:

```bash
yarn test:icons -u
```

### 4. DOM Manipulation Issues

Tests involving direct DOM manipulation (like those in `IconStyles.test.js`) may have issues in the Jest environment. Make sure to:

- Use JSDOM-compatible methods
- Mock any browser APIs not available in JSDOM
- Use @testing-library/react for rendering components

### 5. Icon Package Mocking

Ensure that the Phosphor Icons package is properly mocked to return consistent output for each test:

```javascript
jest.mock('@phosphor-icons/react', () => ({
  Heart: (props) => (
    <svg
      data-testid="mock-phosphor-heart"
      width={props.size || 24}
      height={props.size || 24}
      color={props.color || 'currentColor'}
      weight={props.weight || 'regular'}
      className={props.className || ''}
    />
  )
  // Add other icons as needed
}));
```

## Extending the Tests

When adding new icon functionality:

1. Add appropriate tests for any new components or utilities
2. Update existing tests if component behavior changes
3. Add new mock implementations to `setupIconTests.js` if new icons are used
4. Run the test suite to ensure no regressions

## Coverage Goals

The icon system tests aim for complete coverage across:

- Unit tests for individual components and functions
- Behavioral tests for user interactions
- Integration tests for components using icons
- Visual tests via snapshots

If you find gaps in coverage, please add appropriate tests.
