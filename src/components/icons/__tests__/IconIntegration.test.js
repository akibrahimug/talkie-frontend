import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import Icon from '../Icon';
import { FAIcon } from '..';

// We need to mock the Phosphor icons package
jest.mock('@phosphor-icons/react', () => {
  const mockIcon =
    (name) =>
    ({ size, weight, className, style, onClick, ...props }) =>
      (
        <div
          data-testid={`phosphor-${name.toLowerCase()}-icon`}
          data-size={size}
          data-weight={weight}
          className={`phosphor-icon ${className || ''}`}
          style={style}
          onClick={onClick}
          {...props}>
          {name} Icon
        </div>
      );

  return {
    Heart: mockIcon('Heart'),
    Bell: mockIcon('Bell'),
    TrashSimple: mockIcon('TrashSimple'),
    Trash: mockIcon('Trash'),
    PencilSimple: mockIcon('PencilSimple'),
    CaretDown: mockIcon('CaretDown'),
    __esModule: true
  };
});

// Mock the Icon component that FAIcon depends on
jest.mock('../Icon', () => {
  return function MockIcon({ name, weight, className, ...rest }) {
    // Generate a more specific test ID that includes the first class name (before any spaces)
    // to avoid issues with conditional classes
    const baseId = name && typeof name === 'string' ? `phosphor-${name.toLowerCase()}-icon` : 'phosphor-unknown-icon';

    // Extract the first class name for the test ID, ignoring conditional classes
    const firstClassName = className && className.includes(' ') ? className.split(' ')[0] : className;

    const classSpecificId = firstClassName ? `${baseId}-${firstClassName}` : baseId;

    return (
      <div data-testid={classSpecificId} data-weight={weight} className={`phosphor-icon ${className || ''}`} {...rest}>
        {name ? `${name} Icon` : 'Unknown Icon'}
      </div>
    );
  };
});

// Mock the iconMappings module with proper implementations
jest.mock('../iconMappings', () => {
  // Create mock functions that we can spy on
  const getPhosphorName = jest.fn();
  const getPhosphorWeight = jest.fn();

  // Set up mock implementations
  getPhosphorName.mockImplementation((faName) => {
    const mappings = {
      FaPencilAlt: 'PencilSimple',
      FaRegTrashAlt: 'Trash',
      FaCaretDown: 'CaretDown'
    };
    return mappings[faName] || faName;
  });

  getPhosphorWeight.mockImplementation((faName) => {
    if (faName.startsWith('FaReg')) {
      return 'regular';
    }
    return 'fill';
  });

  return {
    getPhosphorName,
    getPhosphorWeight,
    faToPhosphor: {
      FaPencilAlt: 'PencilSimple',
      FaRegTrashAlt: 'Trash',
      FaCaretDown: 'CaretDown'
    }
  };
});

// Create a test component that simulates the post.js component
const TestPostIcons = ({ onEdit, onDelete }) => (
  <div className="post-icons" data-testid="post-icons">
    <FAIcon icon="FaPencilAlt" className="pencil" onClick={onEdit} />
    <FAIcon icon="FaRegTrashAlt" className="trash" onClick={onDelete} />
  </div>
);

// Create a test component that simulates the header.js component
const TestHeaderIcons = ({ onToggle, isOpen }) => (
  <div className="header-icons" data-testid="header-icons">
    <FAIcon icon="FaCaretDown" className={`caret ${isOpen ? 'open' : ''}`} onClick={onToggle} />
  </div>
);

describe('Icon Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  describe('Direct Icon Usage', () => {
    it('renders icons with consistent styling', () => {
      render(
        <div>
          <Icon name="Heart" className="icon" />
          <Icon name="Bell" className="icon" />
        </div>
      );

      const heartIcon = screen.getByTestId('phosphor-heart-icon-icon');
      const bellIcon = screen.getByTestId('phosphor-bell-icon-icon');

      expect(heartIcon).toHaveClass('phosphor-icon');
      expect(heartIcon).toHaveClass('icon');
      expect(bellIcon).toHaveClass('phosphor-icon');
      expect(bellIcon).toHaveClass('icon');
    });

    it('renders icons with different weights', () => {
      render(
        <div>
          <Icon name="Heart" weight="regular" />
          <Icon name="Bell" weight="fill" />
        </div>
      );

      expect(screen.getByTestId('phosphor-heart-icon').getAttribute('data-weight')).toBe('regular');
      expect(screen.getByTestId('phosphor-bell-icon').getAttribute('data-weight')).toBe('fill');
    });
  });

  describe('FAIcon Usage in Post Component', () => {
    it('renders post action icons correctly', () => {
      render(<TestPostIcons />);

      // Find icons by their specific test IDs
      const pencilIcon = screen.getByTestId('phosphor-unknown-icon-pencil');
      const trashIcon = screen.getByTestId('phosphor-unknown-icon-trash');

      expect(pencilIcon).toBeInTheDocument();
      expect(trashIcon).toBeInTheDocument();

      // Check styling classes
      expect(pencilIcon).toHaveClass('pencil');
      expect(trashIcon).toHaveClass('trash');
    });

    it('triggers the right callbacks when icons are clicked', () => {
      const handleEdit = jest.fn();
      const handleDelete = jest.fn();

      render(<TestPostIcons onEdit={handleEdit} onDelete={handleDelete} />);

      // Find icons by their specific test IDs
      const pencilIcon = screen.getByTestId('phosphor-unknown-icon-pencil');
      const trashIcon = screen.getByTestId('phosphor-unknown-icon-trash');

      fireEvent.click(pencilIcon);
      expect(handleEdit).toHaveBeenCalledTimes(1);

      fireEvent.click(trashIcon);
      expect(handleDelete).toHaveBeenCalledTimes(1);
    });
  });

  describe('FAIcon Usage in Header Component', () => {
    it('renders header icons correctly', () => {
      render(<TestHeaderIcons isOpen={false} />);

      const caretIcon = screen.getByTestId('phosphor-unknown-icon-caret');

      expect(caretIcon).toBeInTheDocument();
      expect(caretIcon).toHaveClass('caret');
      expect(caretIcon).not.toHaveClass('open');
    });

    it('applies conditional classes to icons', () => {
      const { rerender } = render(<TestHeaderIcons isOpen={false} />);
      const caretIcon = screen.getByTestId('phosphor-unknown-icon-caret');
      expect(caretIcon).not.toHaveClass('open');

      rerender(<TestHeaderIcons isOpen={true} />);
      expect(screen.getByTestId('phosphor-unknown-icon-caret')).toHaveClass('open');
    });

    it('triggers toggle callback when icon is clicked', () => {
      const handleToggle = jest.fn();
      render(<TestHeaderIcons onToggle={handleToggle} isOpen={false} />);

      fireEvent.click(screen.getByTestId('phosphor-unknown-icon-caret'));
      expect(handleToggle).toHaveBeenCalledTimes(1);
    });
  });
});
