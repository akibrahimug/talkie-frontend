import axios from '@services/axios';

/**
 * UserService class for handling user-related operations.
 */
class UserService {
  /**
   * Get user suggestions.
   * @returns {Promise<object>} - The response from the server
   */
  async getUserSuggestions() {
    const response = await axios.get('/user/profile/user/suggestions');
    return response;
  }

  /**
   * Logout user.
   * @returns {Promise<object>} - The response from the server
   */
  async logoutUser() {
    const response = await axios.get('/signout');
    return response;
  }

  /**
   * Check current user.
   * @returns {Promise<object>} - The response from the server
   */
  async checkCurrentUser() {
    const response = await axios.get('/currentuser');
    return response;
  }

  /**
   * Get all users.
   * @param {number} page - The page number
   * @returns {Promise<object>} - The response from the server
   */
  async getAllUsers(page) {
    const response = await axios.get(`/user/all/${page}`);
    return response;
  }

  /**
   * Search users.
   * @param {string} query - The search query
   * @returns {Promise<object>} - The response from the server
   */
  async searchUsers(query) {
    const response = await axios.get(`/user/profile/search/${query}`);
    return response;
  }

  /**
   * Get user profile by user id.
   * @param {string} userId - The user id
   * @returns {Promise<object>} - The response from the server
   */
  async getUserProfileByUserId(userId) {
    const response = await axios.get(`/user/profile/${userId}`);
    return response;
  }

  /**
   * Get user profile by username.
   * @param {string} username - The username
   * @param {string} userId - The user id
   * @param {string} uId - The current user id
   * @returns {Promise<object>} - The response from the server
   */
  async getUserProfileByUsername(username, userId, uId) {
    const response = await axios.get(`/user/profile/posts/${username}/${userId}/${uId}`);
    return response;
  }

  /**
   * Change user password.
   * @param {object} body - The password data
   * @returns {Promise<object>} - The response from the server
   */
  async changePassword(body) {
    const response = await axios.put('/user/profile/change-password', body);
    return response;
  }

  /**
   * Update notification settings.
   * @param {object} settings - The notification settings
   * @returns {Promise<object>} - The response from the server
   */
  async updateNotificationSettings(settings) {
    const response = await axios.put('/user/profile/settings', settings);
    return response;
  }

  /**
   * Update basic info.
   * @param {object} info - The basic info
   * @returns {Promise<object>} - The response from the server
   */
  async updateBasicInfo(info) {
    const response = await axios.put('/user/profile/basic-info', info);
    return response;
  }

  /**
   * Update social links.
   * @param {object} info - The social links
   * @returns {Promise<object>} - The response from the server
   */
  async updateSocialLinks(info) {
    const response = await axios.put('/user/profile/social-links', info);
    return response;
  }
}

export const userService = new UserService();
