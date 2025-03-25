const React = require('react');

// Helper function to create consistent mock icons
const createMockIcon = (name) => {
  const MockIcon = ({ size, weight, className, style, onClick, ...props }) => {
    return React.createElement(
      'div',
      {
        'data-testid': `phosphor-${name.toLowerCase()}-icon`,
        'data-size': size,
        'data-weight': weight,
        className,
        style,
        onClick,
        ...props
      },
      `${name} Icon`
    );
  };

  // Set displayName for better debugging
  MockIcon.displayName = name;

  return MockIcon;
};

// Create mock implementations for all icons used in tests
const icons = {
  // Common icons used across the app
  Heart: createMockIcon('Heart'),
  Bell: createMockIcon('Bell'),
  TrashSimple: createMockIcon('TrashSimple'),
  Trash: createMockIcon('Trash'),
  User: createMockIcon('User'),
  X: createMockIcon('X'),
  MagnifyingGlass: createMockIcon('MagnifyingGlass'),
  PencilSimple: createMockIcon('PencilSimple'),
  CaretDown: createMockIcon('CaretDown'),
  CaretUp: createMockIcon('CaretUp'),
  Check: createMockIcon('Check'),
  Circle: createMockIcon('Circle'),
  Envelope: createMockIcon('Envelope'),
  Globe: createMockIcon('Globe'),
  ChatTeardrop: createMockIcon('ChatTeardrop'),
  ArrowLeft: createMockIcon('ArrowLeft'),
  ArrowRight: createMockIcon('ArrowRight'),
  ArrowUp: createMockIcon('ArrowUp'),
  SpinnerGap: createMockIcon('SpinnerGap'),
  PaperPlaneRight: createMockIcon('PaperPlaneRight'),
  Newspaper: createMockIcon('Newspaper'),
  ChatCircle: createMockIcon('ChatCircle'),
  UsersThree: createMockIcon('UsersThree'),
  UserPlus: createMockIcon('UserPlus'),
  Image: createMockIcon('Image'),
  Key: createMockIcon('Key'),
  LockSimple: createMockIcon('LockSimple'),
  UserCheck: createMockIcon('UserCheck'),

  // Mark this as an ES module for Jest
  __esModule: true
};

// Add a simple test to satisfy Jest's requirement
describe('Phosphor Icons Mock', () => {
  test('provides mock icons', () => {
    expect(icons.Heart).toBeDefined();
    expect(typeof icons.Heart).toBe('function');
  });
});

module.exports = icons;
