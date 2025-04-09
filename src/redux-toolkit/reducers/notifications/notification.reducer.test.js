import reducer, { addNotification, clearNotification } from '@redux/reducers/notifications/notification.reducer';
import checkIcon from '@assets/images/check.svg';
import errorIcon from '@assets/images/error.svg';
import infoIcon from '@assets/images/info.svg';
import warningIcon from '@assets/images/warning.svg';
import { socketService } from '@services/sockets/socket.service';

// Mock the socket service first
jest.mock('@services/sockets/socket.service', () => ({
  socketService: {
    socket: {
      emit: jest.fn(),
      id: 'test-socket-id'
    }
  }
}));

describe('notification reducer', () => {
  // Create a fresh initial state for each test
  let initialState;

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset initial state for each test
    initialState = [];

    // Reset any state modification in the reducer's module scope
    // Force the reducer to clear its internal state
    reducer(undefined, clearNotification());
  });

  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual([]);
  });

  it('should add a success notification', () => {
    const action = addNotification({ message: 'Success message', type: 'success' });
    const state = reducer(initialState, action);

    expect(state.length).toBe(1);
    expect(state[0].description).toBe('Success message');
    expect(state[0].type).toBe('success');
    expect(state[0].icon).toBe(checkIcon);
    expect(state[0].backgroundColor).toBe('#5cb85c');
  });

  it('should add an error notification', () => {
    // Start with fresh empty state
    const action = addNotification({ message: 'Error message', type: 'error' });
    const state = reducer([], action);

    expect(state.length).toBe(1);
    expect(state[0].description).toBe('Error message');
    expect(state[0].type).toBe('error');
    expect(state[0].icon).toBe(errorIcon);
    expect(state[0].backgroundColor).toBe('#d9534f');
  });

  it('should add an info notification', () => {
    // Start with fresh empty state
    const action = addNotification({ message: 'Info message', type: 'info' });
    const state = reducer([], action);

    expect(state.length).toBe(1);
    expect(state[0].description).toBe('Info message');
    expect(state[0].type).toBe('info');
    expect(state[0].icon).toBe(infoIcon);
    expect(state[0].backgroundColor).toBe('#5bc0de');
  });

  it('should add a warning notification', () => {
    // Start with fresh empty state
    const action = addNotification({ message: 'Warning message', type: 'warning' });
    const state = reducer([], action);

    expect(state.length).toBe(1);
    expect(state[0].description).toBe('Warning message');
    expect(state[0].type).toBe('warning');
    expect(state[0].icon).toBe(warningIcon);
    expect(state[0].backgroundColor).toBe('#f0ad4e');
  });

  it('should place new notifications at the beginning of the list', () => {
    // Start with fresh empty state
    let state = reducer([], addNotification({ message: 'First message', type: 'success' }));
    state = reducer(state, addNotification({ message: 'Second message', type: 'error' }));

    expect(state.length).toBe(2);
    expect(state[0].description).toBe('Second message');
    expect(state[1].description).toBe('First message');
  });

  it('should not add duplicate notifications based on description', () => {
    // Start with fresh empty state
    let state = reducer([], addNotification({ message: 'Duplicate message', type: 'success' }));
    state = reducer(state, addNotification({ message: 'Duplicate message', type: 'success' }));

    expect(state.length).toBe(1);
    expect(state[0].description).toBe('Duplicate message');
  });

  it('should clear all notifications', () => {
    // Start with fresh empty state
    let state = reducer([], addNotification({ message: 'Test message', type: 'success' }));
    expect(state.length).toBe(1);

    state = reducer(state, clearNotification());
    expect(state.length).toBe(0);
  });

  // Implement the previously skipped test
  it('should emit socket refresh event for non-error/info notifications', () => {
    // Ensure socket.emit is mocked and ready
    jest.clearAllMocks();

    // Apply a non-error/non-info notification
    reducer([], addNotification({ message: 'Success message', type: 'success' }));

    // In the actual implementation, the socket.emit call would happen inside the reducer
    // For this test, we can modify our expectations to match what the implementation should do

    // Success notifications should trigger a socket refresh
    expect(socketService.socket.emit).toHaveBeenCalled();
    expect(socketService.socket.emit).toHaveBeenCalledWith('refresh notification', {
      userTo: 'test-socket-id'
    });
  });

  it('should not emit socket refresh event for error notifications', () => {
    jest.clearAllMocks();
    reducer([], addNotification({ message: 'Error message', type: 'error' }));

    expect(socketService.socket.emit).not.toHaveBeenCalled();
  });

  it('should not emit socket refresh event for info notifications', () => {
    jest.clearAllMocks();
    reducer([], addNotification({ message: 'Info message', type: 'info' }));

    expect(socketService.socket.emit).not.toHaveBeenCalled();
  });

  it('should not emit socket refresh event if socket is not available', () => {
    // Mock the socket as undefined temporarily
    const originalSocket = socketService.socket;
    Object.defineProperty(socketService, 'socket', {
      value: undefined,
      configurable: true
    });

    reducer([], addNotification({ message: 'Success message', type: 'success' }));

    // Restore the original socket
    Object.defineProperty(socketService, 'socket', {
      value: originalSocket,
      configurable: true
    });

    // Since socket was undefined, emit should not have been called
    expect(socketService.socket.emit).not.toHaveBeenCalled();
  });
});
