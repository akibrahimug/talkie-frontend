// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
require('@testing-library/jest-dom');
require('jest-canvas-mock');

const { server } = require('@mocks/server');

/**
 * Setup server before all tests.
 */
beforeAll(() => server.listen());

/**
 * Reset server handlers after each test.
 */
afterEach(() => server.resetHandlers());

/**
 * Close server after all tests.
 */
afterAll(() => server.close());

// Mock window.matchMedia and window.ResizeObserver for components that rely on them
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn()
  }))
});

// Mock ResizeObserver, which might be used by certain components
window.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn()
}));

// CSS Modules are now handled by moduleNameMapper in the package.json
// jest.mock('.*\\.scss$', () => ({}));

// Fix for JSDOM not having createRange
if (document.createRange === undefined) {
  document.createRange = () => ({
    setStart: () => {},
    setEnd: () => {},
    commonAncestorContainer: {
      nodeName: 'BODY',
      ownerDocument: document
    },
    createContextualFragment: (str) => {
      const temp = document.createElement('template');
      temp.innerHTML = str;
      return temp.content;
    }
  });
}

// Suppress console warnings/errors during tests
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

beforeAll(() => {
  console.error = jest.fn();
  console.warn = jest.fn();
});

afterAll(() => {
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
});

// Mock the socket service
jest.mock('@services/sockets/socket.service', () => ({
  socketService: {
    socket: {
      emit: jest.fn(),
      on: jest.fn((event, callback) => {
        return jest.fn();
      }),
      off: jest.fn()
    }
  }
}));
