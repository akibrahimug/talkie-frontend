import { notificationsService } from '@services/api/notications/notifications.service';
import { socketService } from '@services/sockets/socket.service';
import { Utils } from '@services/utils/utils.service';
import { cloneDeep, find, findIndex, remove, sumBy } from 'lodash';
import { timeAgo } from '@services/utils/timeago.utils.service';

/**
 * NotificationUtils class for handling notification operations.
 */
export class NotificationUtils {
  // SocketIO notification
  static socketIONotification = (profile, notifications, setNotifications, type, setNotificationsCount) => {
    socketService?.socket?.on('insert notification', (data, userToData) => {
      if (profile?._id === userToData.userTo) {
        notifications = [...data];
        // Map notification items to dropdown items
        if (type === 'notificationPage') {
          setNotifications(notifications);
        } else {
          // Map notification items to dropdown items
          const mappedNotifications = NotificationUtils.mapNotificationDropdownItems(
            notifications,
            setNotificationsCount
          );
          setNotifications(mappedNotifications);
        }
      }
    });

    // Update notification as read
    socketService?.socket?.on('update notification', (notificationId) => {
      notifications = cloneDeep(notifications);
      const notificationData = find(notifications, (notification) => notification._id === notificationId);
      if (!notificationData) {
        return;
      }
      // Find index of notification
      const index = findIndex(notifications, (notification) => notification._id === notificationId);
      notificationData.read = true;
      notifications.splice(index, 1, notificationData);
      if (type === 'notificationPage') {
        setNotifications(notifications);
      } else {
        // Map notification items to dropdown items
        const mappedNotifications = NotificationUtils.mapNotificationDropdownItems(
          notifications,
          setNotificationsCount
        );
        setNotifications(mappedNotifications);
      }
    });

    // Delete notification
    socketService?.socket?.on('delete notification', (notificationId) => {
      notifications = cloneDeep(notifications);
      remove(notifications, { _id: notificationId });
      if (type === 'notificationPage') {
        setNotifications(notifications);
      } else {
        // Map notification items to dropdown items
        const mappedNotifications = NotificationUtils.mapNotificationDropdownItems(
          notifications,
          setNotificationsCount
        );
        setNotifications(mappedNotifications);
      }
    });
  };

  // Track notifications that have already been shown in a dialog
  static displayedNotifications = new Set();

  /**
   * Map notification dropdown items.
   * @param {object} notificationData - The notification data
   * @param {function} setNotificationsCount - The function to set the notifications count
   * @returns {array} - The mapped notification items
   */
  static mapNotificationDropdownItems(notificationData, setNotificationsCount) {
    const items = [];
    // Map notification items
    for (const notification of notificationData) {
      const item = {
        _id: notification?._id,
        topText: notification?.topText ? notification?.topText : notification?.message,
        subText: timeAgo.transform(notification?.createdAt),
        createdAt: notification?.createdAt,
        username: notification?.userFrom ? notification?.userFrom.username : notification?.username,
        avatarColor: notification?.userFrom ? notification?.userFrom.avatarColor : notification?.avatarColor,
        profilePicture: notification?.userFrom ? notification?.userFrom.profilePicture : notification?.profilePicture,
        read: notification?.read,
        post: notification?.post,
        imgUrl: notification?.imgId
          ? Utils.appImageUrl(notification?.imgVersion, notification?.imgId)
          : notification?.gifUrl
          ? notification?.gifUrl
          : notification?.imgUrl,
        comment: notification?.comment,
        reaction: notification?.reaction,
        senderName: notification?.userFrom ? notification?.userFrom.username : notification?.username,
        notificationType: notification?.notificationType
      };
      items.push(item);
    }

    // Count unread notifications
    const count = sumBy(items, (selectedNotification) => {
      // If notification is not read, increment count
      // If notification is read, do not increment count
      return !selectedNotification.read ? 1 : 0;
    });
    // Set count of unread notifications
    setNotificationsCount(count);
    return items;
  }

  /**
   * Mark notification as read.
   * If notification is not a follow notification, set the notification dialog content.
   * @param {string} messageId - The ID of the notification to mark as read
   * @param {object} notification - The notification object
   * @param {function} setNotificationDialogContent - The function to set the notification dialog content
   *
   */
  static async markMessageAsRead(messageId, notification, setNotificationDialogContent) {
    // Don't show notification if:
    // 1. It's a follow notification
    // 2. It has already been displayed
    if (notification.notificationType !== 'follows' && !this.displayedNotifications.has(messageId)) {
      console.log('Displaying notification dialog for:', notification?.post);

      const notificationDialog = {
        createdAt: notification?.createdAt,
        post: notification?.post,
        imgUrl: notification?.imgId
          ? Utils.appImageUrl(notification?.imgVersion, notification?.imgId)
          : notification?.gifUrl
          ? notification?.gifUrl
          : notification?.imgUrl,
        comment: notification?.comment,
        reaction: notification?.reaction,
        senderName: notification?.userFrom ? notification?.userFrom.username : notification?.username
      };
      setNotificationDialogContent(notificationDialog);

      // Add this notification to the set of displayed notifications
      this.displayedNotifications.add(messageId);
    } else {
      console.log('Skipping notification dialog display.');
    }

    // Always mark the notification as read in the database
    await notificationsService.markNotificationAsRead(messageId);
  }

  /**
   * Reset the displayed notification for a specific ID or clear all if no ID provided
   * @param {string} messageId - Optional messageId to reset
   */
  static resetDisplayedNotification(messageId = null) {
    if (messageId) {
      this.displayedNotifications.delete(messageId);
    } else {
      this.displayedNotifications.clear();
    }
  }
}
