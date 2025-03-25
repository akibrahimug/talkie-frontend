import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Icon from '../Icon';

// Mock PhosphorIcons package first due to hoisting issues
jest.mock('@phosphor-icons/react', () => {
  return {
    Heart: function Heart({ size, weight, className, style, onClick, ...props }) {
      return (
        <div
          data-testid="phosphor-heart-icon"
          data-size={size}
          data-weight={weight}
          className={className}
          style={style}
          onClick={onClick}
          {...props}>
          Heart Icon
        </div>
      );
    },
    User: function User({ size, weight, className, style, onClick, ...props }) {
      return (
        <div
          data-testid="phosphor-user-icon"
          data-size={size}
          data-weight={weight}
          className={className}
          style={style}
          onClick={onClick}
          {...props}>
          User Icon
        </div>
      );
    },
    // Add a default export property
    __esModule: true
  };
});

// Mock the CSS import
jest.mock('../Icon.scss', () => ({}));

describe('Icon Component', () => {
  let originalConsoleWarn;

  beforeEach(() => {
    // Save original console.warn
    originalConsoleWarn = console.warn;
    // Mock console.warn
    console.warn = jest.fn();
  });

  afterEach(() => {
    // Restore original console.warn
    console.warn = originalConsoleWarn;
    jest.clearAllMocks();
  });

  it('renders the correct icon based on name prop', () => {
    render(<Icon name="Heart" />);
    expect(screen.getByTestId('phosphor-heart-icon')).toBeInTheDocument();
    expect(screen.getByText('Heart Icon')).toBeInTheDocument();
  });

  it('applies the default size when no size is specified', () => {
    render(<Icon name="Heart" />);
    expect(screen.getByTestId('phosphor-heart-icon').getAttribute('data-size')).toBe('20');
  });

  it('applies the correct size from size prop (predefined size)', () => {
    render(<Icon name="Heart" size="lg" />);
    expect(screen.getByTestId('phosphor-heart-icon').getAttribute('data-size')).toBe('24');
  });

  it('applies the passed numeric size directly', () => {
    render(<Icon name="Heart" size={32} />);
    expect(screen.getByTestId('phosphor-heart-icon').getAttribute('data-size')).toBe('32');
  });

  it('applies the regular weight by default', () => {
    render(<Icon name="Heart" />);
    expect(screen.getByTestId('phosphor-heart-icon').getAttribute('data-weight')).toBe('regular');
  });

  it('applies the specified weight', () => {
    render(<Icon name="Heart" weight="fill" />);
    expect(screen.getByTestId('phosphor-heart-icon').getAttribute('data-weight')).toBe('fill');
  });

  it('applies className correctly', () => {
    render(<Icon name="Heart" className="custom-icon" />);
    expect(screen.getByTestId('phosphor-heart-icon')).toHaveClass('phosphor-icon');
    expect(screen.getByTestId('phosphor-heart-icon')).toHaveClass('custom-icon');
  });

  it('applies color via style prop when specified', () => {
    render(<Icon name="Heart" color="#ff0000" />);
    const iconElement = screen.getByTestId('phosphor-heart-icon');
    expect(iconElement.style.color).toBe('rgb(255, 0, 0)');
  });

  it('logs a warning and returns null when icon name does not exist', () => {
    const { container } = render(<Icon name="NonExistentIcon" />);
    expect(console.warn).toHaveBeenCalledWith('Icon "NonExistentIcon" not found in Phosphor Icons library');
    expect(container).toBeEmptyDOMElement();
  });

  it('renders a different icon when name changes', () => {
    const { rerender } = render(<Icon name="Heart" />);
    expect(screen.getByTestId('phosphor-heart-icon')).toBeInTheDocument();

    rerender(<Icon name="User" />);
    expect(screen.getByTestId('phosphor-user-icon')).toBeInTheDocument();
  });

  it('passes through additional props to the icon component', () => {
    const onClickMock = jest.fn();
    render(<Icon name="Heart" onClick={onClickMock} data-custom="test" />);

    const icon = screen.getByTestId('phosphor-heart-icon');
    expect(icon).toHaveAttribute('data-custom', 'test');

    // Test the click handler
    fireEvent.click(icon);
    expect(onClickMock).toHaveBeenCalled();
  });
});
