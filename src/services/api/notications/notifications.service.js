import axios from '@services/axios';

/**
 * NotificationsService class for handling notifications-related operations.
 */
class NotificationsService {
  /**
   * Get user notifications.
   * @returns {Promise<object>} - The response from the server
   */
  async getUserNotifications() {
    const response = await axios.get('/notifications');
    return response;
  }

  /**
   * Mark a notification as read.
   * @param {string} messageId - The message id
   * @returns {Promise<object>} - The response from the server
   */
  async markNotificationAsRead(messageId) {
    const response = await axios.put(`/notification/${messageId}`);
    return response;
  }

  /**
   * Delete a notification.
   * @param {string} messageId - The message id
   * @returns {Promise<object>} - The response from the server
   */
  async deleteNotification(messageId) {
    const response = await axios.delete(`/notification/${messageId}`);
    return response;
  }
}

export const notificationsService = new NotificationsService();
