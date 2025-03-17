import axios from 'axios';

/**
 * GiphyService class for handling Giphy API operations.
 */
const GIPHY_URL = 'https://api.giphy.com/v1/gifs';
const API_KEY = process.env.REACT_APP_GIPHY_API_KEY;

class GiphyService {
  /**
   * Search for GIFs.
   * @param {string} query - The search query
   * @returns {Promise<object>} - The response from the server
   */
  async search(query) {
    const response = await axios.get(`${GIPHY_URL}/search`, { params: { api_key: API_KEY, q: query } });
    return response;
  }

  /**
   * Get trending GIFs.
   * @returns {Promise<object>} - The response from the server
   */
  async trending() {
    const response = await axios.get(`${GIPHY_URL}/trending`, { params: { api_key: API_KEY } });
    return response;
  }
}

export const giphyService = new GiphyService();
