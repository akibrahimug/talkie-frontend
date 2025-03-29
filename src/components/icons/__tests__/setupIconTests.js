/**
 * Setup file for icon system tests
 * This file provides common mock implementations for testing icons
 */
import React from 'react';

// Create a factory function to generate the mockIcon function
// This avoids closure-capturing issues with Jest mocks
const createMockIconFunction = () => {
  return function mockIcon(name) {
    return function MockedIcon({ size, weight, className, style, onClick, ...props }) {
      return (
        <div
          data-testid={`phosphor-${name.toLowerCase()}-icon`}
          data-size={size}
          data-weight={weight}
          className={className}
          style={style}
          onClick={onClick}
          {...props}>
          {name} Icon
        </div>
      );
    };
  };
};

// Mock implementation of the PhosphorIcons package
export const mockPhosphorIcons = () => {
  const mockIcon = createMockIconFunction();

  jest.mock('@phosphor-icons/react', () => {
    return {
      // Default icons used in tests
      Heart: mockIcon('Heart'),
      Bell: mockIcon('Bell'),
      User: mockIcon('User'),
      Trash: mockIcon('Trash'),
      X: mockIcon('X'),
      MagnifyingGlass: mockIcon('MagnifyingGlass'),
      PencilSimple: mockIcon('PencilSimple'),
      CaretDown: mockIcon('CaretDown'),
      CaretUp: mockIcon('CaretUp'),
      Check: mockIcon('Check'),
      Circle: mockIcon('Circle'),
      Envelope: mockIcon('Envelope'),
      Globe: mockIcon('Globe'),
      ChatTeardrop: mockIcon('ChatTeardrop'),
      ArrowLeft: mockIcon('ArrowLeft'),
      ArrowRight: mockIcon('ArrowRight'),
      ArrowUp: mockIcon('ArrowUp'),
      SpinnerGap: mockIcon('SpinnerGap'),
      PaperPlaneRight: mockIcon('PaperPlaneRight'),
      Newspaper: mockIcon('Newspaper'),
      ChatCircle: mockIcon('ChatCircle'),
      UsersThree: mockIcon('UsersThree'),
      UserPlus: mockIcon('UserPlus'),
      Image: mockIcon('Image'),
      Key: mockIcon('Key'),
      LockSimple: mockIcon('LockSimple'),
      UserCheck: mockIcon('UserCheck'),
      // Add more icons as needed

      // Important: Mark as ES module
      __esModule: true
    };
  });
};

// Mock Icon.scss styles - simplified to avoid document reference
export const mockIconStyles = () => {
  jest.mock('../Icon.scss', () => ({}));
};

// Mock both icons and styles together
export const setupIconTests = () => {
  mockPhosphorIcons();
  mockIconStyles();
};

// Add a basic test to satisfy Jest's requirement for test files
describe('setupIconTests', () => {
  it('provides mock functions', () => {
    expect(typeof mockPhosphorIcons).toBe('function');
    expect(typeof mockIconStyles).toBe('function');
    expect(typeof setupIconTests).toBe('function');
  });
});

export default setupIconTests;
