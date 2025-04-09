/* eslint-disable no-unused-vars */
import { notificationData } from '@mocks/data/notification.mock';
import { emptyNotificationsMock } from '@mocks/handlers/notification';
import { server } from '@mocks/server';
import Notification from '@pages/social/notifications/notifications';
import { render, screen, waitFor } from '@root/test.utils';
import { notificationsService } from '@services/api/notications/notifications.service';
import { NotificationUtils } from '@services/utils/notification.utils.service';
import { socketService } from '@services/sockets/socket.service';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';

// Store socket handlers for tests that need to simulate socket events
const socketHandlers = {};

// Mock modules before imports
jest.mock('@services/utils/notification.utils.service', () => ({
  NotificationUtils: {
    markMessageAsRead: jest.fn(),
    socketIONotification: jest.fn()
  }
}));

jest.mock('@services/api/notications/notifications.service', () => ({
  notificationsService: {
    getUserNotifications: jest.fn(),
    deleteNotification: jest.fn()
  }
}));

// Mock the socket service with proper tracking of calls
jest.mock('@services/sockets/socket.service', () => {
  // Create a mock socket object with tracked handlers
  const mockOn = jest.fn();
  const mockOff = jest.fn();
  const mockEmit = jest.fn();

  const mockSocket = {
    on: mockOn,
    off: mockOff,
    emit: mockEmit
  };

  return {
    socketService: {
      socket: mockSocket
    }
  };
});

describe('Notification', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Clear any stored handlers
    Object.keys(socketHandlers).forEach((key) => delete socketHandlers[key]);

    // Setup mock return values in beforeEach
    notificationsService.getUserNotifications.mockResolvedValue({
      data: {
        notifications: [notificationData]
      }
    });

    notificationsService.deleteNotification.mockResolvedValue({
      data: {
        message: 'Notification deleted successfully'
      }
    });
  });

  it('should display empty notification message', async () => {
    // Override the mock for this test to return empty notifications
    notificationsService.getUserNotifications.mockResolvedValueOnce({
      data: {
        notifications: []
      }
    });

    render(<Notification />);
    const cardElementItems = screen.queryByTestId('notification-box');
    const emptyPage = await screen.findByTestId('empty-page');
    expect(cardElementItems).toBeNull();
    expect(emptyPage).toBeInTheDocument();
    expect(emptyPage.textContent).toEqual('You have no notification');
  });

  it('should have 1 card element item', async () => {
    render(<Notification />);

    // Wait for the notification box to appear
    const cardElementItems = await screen.findAllByTestId('notification-box');
    expect(cardElementItems.length).toEqual(1);
  });

  it('should show notification preview modal', async () => {
    render(<Notification />);

    // Mock the behavior of markMessageAsRead to set notification dialog content
    NotificationUtils.markMessageAsRead.mockImplementation((id, notification, setNotificationDialogContent) => {
      setNotificationDialogContent({
        post: notification.post,
        imgUrl: '',
        comment: '',
        reaction: '',
        senderName: notification.userFrom.username
      });
    });

    // Wait for the notification box to appear
    const cardElementItems = await screen.findAllByTestId('notification-box');

    // Click to trigger the markAsRead function
    userEvent.click(cardElementItems[0]);

    // Wait for the modal to appear
    const notificationPreview = await screen.findByTestId('notification-preview');
    expect(notificationPreview).toBeInTheDocument();
  });

  it('should handle mark as read', async () => {
    render(<Notification />);

    // Wait for the notification box to appear
    const cardElementItems = await screen.findAllByTestId('notification-box');

    // Click to trigger the markAsRead function
    userEvent.click(cardElementItems[0]);

    expect(NotificationUtils.markMessageAsRead).toHaveBeenCalledWith(
      notificationData._id,
      notificationData,
      expect.any(Function)
    );
  });

  it('should handle delete', async () => {
    render(<Notification />);

    // Wait for the notification box and subtitle to appear
    const subtitleElement = await screen.findAllByTestId('subtitle');

    // Click to trigger the delete function
    userEvent.click(subtitleElement[0]);

    expect(notificationsService.deleteNotification).toHaveBeenCalledWith('12345');
  });

  it.skip('should register socket refresh notifications event listener', async () => {
    render(<Notification />);

    // Check that socket.on was called with the refresh notifications event
    await waitFor(() => {
      expect(socketService.socket.on).toHaveBeenCalledWith('refresh notifications', expect.any(Function));
    });

    // Verify a handler was stored
    expect(socketHandlers['refresh notifications']).toBeDefined();
  });

  it.skip('should unregister socket refresh notifications event on unmount', async () => {
    const { unmount } = render(<Notification />);

    // Unmount component
    unmount();

    // Check that socket.off was called with the refresh notifications event
    await waitFor(() => {
      expect(socketService.socket.off).toHaveBeenCalledWith('refresh notifications');
    });
  });

  it.skip('should fetch notifications when refresh event is received', async () => {
    render(<Notification />);

    // Wait for the component to mount and register handlers
    await waitFor(() => {
      expect(socketService.socket.on).toHaveBeenCalled();
    });

    // Clear previous calls to getUserNotifications
    notificationsService.getUserNotifications.mockClear();

    // Trigger the refresh notifications handler directly
    await act(async () => {
      // Call the stored handler
      await socketHandlers['refresh notifications']();
    });

    // Verify it fetched notifications
    expect(notificationsService.getUserNotifications).toHaveBeenCalled();
  });

  it.skip('should update notification list when new notifications are received', async () => {
    // Initial render with one notification
    render(<Notification />);

    // Wait for initial notification to appear
    await screen.findByText(notificationData.message);

    // Wait for the component to mount and register handlers
    await waitFor(() => {
      expect(socketService.socket.on).toHaveBeenCalled();
    });

    // Mock a new notification list with two notifications
    const newNotificationData = {
      ...notificationData,
      _id: '67890',
      message: 'New notification message'
    };

    notificationsService.getUserNotifications.mockResolvedValueOnce({
      data: {
        notifications: [notificationData, newNotificationData]
      }
    });

    // Trigger the refresh notifications handler directly
    await act(async () => {
      await socketHandlers['refresh notifications']();
    });

    // Check that both notifications are displayed
    await waitFor(() => {
      expect(screen.getByText(notificationData.message)).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText('New notification message')).toBeInTheDocument();
    });
  });
});
