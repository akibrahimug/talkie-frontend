import axios from '@services/axios';

/**
 * AuthService class for handling authentication-related operations.
 */
class AuthService {
  /**
   * Sign up a new user.
   * @param {object} body - The signup data
   * @returns {Promise<object>} - The response from the server
   */
  async signup(body) {
    const response = await axios.post('/signup', body);
    return response;
  }

  /**
   * Sign in a user.
   * @param {object} body - The signin data
   * @returns {Promise<object>} - The response from the server
   */
  async signin(body) {
    const response = await axios.post('/signin', body);
    return response;
  }

  /**
   * Forgot password.
   * @param {string} email - The email
   * @returns {Promise<object>} - The response from the server
   */
  async forgotPassword(email) {
    const response = await axios.post('/forgot-password', { email });
    return response;
  }

  /**
   * Reset password.
   * @param {string} token - The token
   * @param {object} body - The reset password data
   * @returns {Promise<object>} - The response from the server
   */
  async resetPassword(token, body) {
    const response = await axios.post(`/reset-password/${token}`, body);
    return response;
  }
}

export const authService = new AuthService();
