import { render, screen, waitFor, act, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Toast from '@components/toast/Toast';
import { Utils } from '@services/utils/utils.service';
import { addNotification, clearNotification } from '@redux/reducers/notifications/notification.reducer';
import { store } from '@redux/store';

// Mock the useDispatch hook
jest.mock('react-redux', () => ({
  useDispatch: () => jest.fn()
}));

// Mock the Utils functions
jest.mock('@services/utils/utils.service', () => ({
  Utils: {
    dispatchClearNotification: jest.fn(),
    generateString: jest.fn().mockReturnValue('mock-id-123')
  }
}));

// Create default notification data
const defaultNotification = {
  id: '1234',
  message: 'This is a message',
  type: 'success',
  createdAt: new Date().toISOString()
};

describe('Toast Component', () => {
  const mockToastList = [
    {
      id: 1,
      description: 'Success notification',
      type: 'success',
      icon: 'success-icon.svg',
      backgroundColor: '#5cb85c'
    },
    {
      id: 2,
      description: 'Error notification',
      type: 'error',
      icon: 'error-icon.svg',
      backgroundColor: '#d9534f'
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should render toast notifications correctly', () => {
    render(<Toast position="top-right" toastList={mockToastList} autoDelete={false} />);

    expect(screen.getAllByTestId('toast-notification')).toHaveLength(2);
    expect(screen.getByText('Success notification')).toBeInTheDocument();
    expect(screen.getByText('Error notification')).toBeInTheDocument();
  });

  it('should apply correct position class', () => {
    render(<Toast position="bottom-left" toastList={mockToastList} autoDelete={false} />);

    const container = screen.getByTestId('toast-notification-container');
    expect(container).toHaveClass('bottom-left');

    const toastNotification = screen.getAllByTestId('toast-notification')[0];
    expect(toastNotification).toHaveClass('bottom-left');
  });

  it('should apply correct background color to toast', () => {
    render(<Toast position="top-right" toastList={mockToastList} autoDelete={false} />);

    const successToast = screen.getAllByTestId('toast-notification')[0];
    const errorToast = screen.getAllByTestId('toast-notification')[1];

    expect(successToast).toHaveStyle('background-color: #5cb85c');
    expect(errorToast).toHaveStyle('background-color: #d9534f');
  });

  it('should remove a toast when the cancel button is clicked', () => {
    render(<Toast position="top-right" toastList={mockToastList} autoDelete={false} />);

    const cancelButtons = screen.getAllByRole('button');
    expect(cancelButtons).toHaveLength(2);

    userEvent.click(cancelButtons[0]);

    expect(screen.queryByText('Success notification')).not.toBeInTheDocument();
    expect(screen.getByText('Error notification')).toBeInTheDocument();
  });

  it('should auto delete toasts after specified time', async () => {
    render(<Toast position="top-right" toastList={mockToastList} autoDelete={true} autoDeleteTime={3000} />);

    expect(screen.getAllByTestId('toast-notification')).toHaveLength(2);

    // Fast-forward time by 3000ms
    act(() => {
      jest.advanceTimersByTime(3000);
    });

    // Wait for the component to update
    await waitFor(() => {
      expect(screen.queryByText('Success notification')).not.toBeInTheDocument();
    });

    // After another 3000ms, the second toast should be gone
    act(() => {
      jest.advanceTimersByTime(3000);
    });

    await waitFor(() => {
      expect(screen.queryByText('Error notification')).not.toBeInTheDocument();
    });
  });

  it('should not auto delete toasts if autoDelete is false', async () => {
    render(<Toast position="top-right" toastList={mockToastList} autoDelete={false} autoDeleteTime={3000} />);

    expect(screen.getAllByTestId('toast-notification')).toHaveLength(2);

    // Fast-forward time
    act(() => {
      jest.advanceTimersByTime(5000);
    });

    // Toasts should still be there
    expect(screen.getByText('Success notification')).toBeInTheDocument();
    expect(screen.getByText('Error notification')).toBeInTheDocument();
  });

  it('should update the toast list when new toasts are added', () => {
    const { rerender } = render(<Toast position="top-right" toastList={[mockToastList[0]]} autoDelete={false} />);

    expect(screen.getByText('Success notification')).toBeInTheDocument();
    expect(screen.queryByText('Error notification')).not.toBeInTheDocument();

    // Add the second toast
    rerender(<Toast position="top-right" toastList={mockToastList} autoDelete={false} />);

    expect(screen.getByText('Success notification')).toBeInTheDocument();
    expect(screen.getByText('Error notification')).toBeInTheDocument();
  });

  it('should apply correct styling to notification message and image when description is short', () => {
    const shortDescriptionToast = [
      {
        id: 1,
        description: 'Short notification',
        type: 'success',
        icon: 'success-icon.svg',
        backgroundColor: '#5cb85c'
      }
    ];

    render(<Toast position="top-right" toastList={shortDescriptionToast} autoDelete={false} />);

    // Find elements with specific classes using 'within'
    const toastNotification = screen.getByTestId('toast-notification');
    const { getByTestId: getByTestIdWithin } = within(toastNotification);

    const notificationImageDiv = getByTestIdWithin('toast-notification-image');
    const notificationMessageDiv = getByTestIdWithin('toast-notification-message');

    expect(notificationImageDiv).toHaveClass('toast-icon');
    expect(notificationMessageDiv).toHaveClass('toast-message');
  });

  it('should not apply toast-icon class when description is long', () => {
    const longDescriptionToast = [
      {
        id: 1,
        description:
          'This is a very long notification message that exceeds 73 characters in length and should not get the toast-icon class applied to it',
        type: 'success',
        icon: 'success-icon.svg',
        backgroundColor: '#5cb85c'
      }
    ];

    render(<Toast position="top-right" toastList={longDescriptionToast} autoDelete={false} />);

    // Find elements with specific classes using 'within'
    const toastNotification = screen.getByTestId('toast-notification');
    const { getByTestId: getByTestIdWithin } = within(toastNotification);

    const notificationImageDiv = getByTestIdWithin('toast-notification-image');
    const notificationMessageDiv = getByTestIdWithin('toast-notification-message');

    expect(notificationImageDiv).not.toHaveClass('toast-icon');
    expect(notificationMessageDiv).not.toHaveClass('toast-message');
  });

  it('should properly clear notifications when all toasts are removed', () => {
    // Arrange: Mock Utils.dispatchClearNotification
    const originalDispatchClearNotification = Utils.dispatchClearNotification;
    Utils.dispatchClearNotification = jest.fn();

    // Render with a single toast
    render(<Toast position="top-right" toastList={[mockToastList[0]]} autoDelete={false} />);

    // Act: Click the cancel button to remove the toast
    const cancelButton = screen.getByRole('button');
    userEvent.click(cancelButton);

    // Assert: Verify the toast is removed and clear notification was called
    expect(screen.queryByText('Success notification')).not.toBeInTheDocument();
    expect(Utils.dispatchClearNotification).toHaveBeenCalled();

    // Cleanup: Restore original implementation
    Utils.dispatchClearNotification = originalDispatchClearNotification;
  });
});
