import { giphyService } from '@services/api/giphy/giphy.service';

export class GiphyUtils {
  /**
   * Get trending gifs.
   * @param {function} setGifs - The function to set the gifs
   * @param {function} setLoading - The function to set the loading state
   */
  static async getTrendingGifs(setGifs, setLoading) {
    setLoading(true);
    try {
      const response = await giphyService.trending();
      setGifs(response.data.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }

  /**
   * Search gifs.
   * @param {string} gif - The search query
   * @param {function} setGifs - The function to set the gifs
   * @param {function} setLoading - The function to set the loading state
   */
  static async searchGifs(gif, setGifs, setLoading) {
    if (gif.length <= 1) {
      GiphyUtils.getTrendingGifs(setGifs, setLoading);
      return;
    }
    setLoading(true);
    try {
      const response = await giphyService.search(gif);
      setGifs(response.data.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }
}
