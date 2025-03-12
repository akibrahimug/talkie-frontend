import { notificationData } from '@mocks/data/notification.mock';
import { emptyNotificationsMock } from '@mocks/handlers/notification';
import { server } from '@mocks/server';
import Notification from '@pages/social/notifications/notifications';
import { render, screen } from '@root/test.utils';
import { notificationsService } from '@services/api/notications/notifications.service';
import { NotificationUtils } from '@services/utils/notification.utils.service';
import userEvent from '@testing-library/user-event';

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

describe('Notification', () => {
  beforeEach(() => {
    jest.clearAllMocks();
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
});
