import axios from '@services/axios';

/**
 * PostService class for handling post-related operations.
 */
class PostService {
  /**
   * Get all posts.
   * @param {number} page - The page number
   * @returns {Promise<object>} - The response from the server
   */
  async getAllPosts(page = 1) {
    const response = await axios.get(`/post/all/${page}`);
    return response;
  }

  /**
   * Create a new post.
   * @param {object} body - The post data
   * @returns {Promise<object>} - The response from the server
   */
  async createPost(body) {
    const response = await axios.post('/post', body);
    return response;
  }

  /**
   * Create a new post with an image.
   * @param {object} body - The post data
   * @returns {Promise<object>} - The response from the server
   */
  async createPostWithImage(body) {
    const response = await axios.post('/post/image/post', body);
    return response;
  }

  /**
   * Create a new post with a video.
   * @param {object} body - The post data
   * @returns {Promise<object>} - The response from the server
   */
  async createPostWithVideo(body) {
    const response = await axios.post('/post/video/post', body);
    return response;
  }

  /**
   * Update a post with an image.
   * @param {string} postId - The post id
   * @param {object} body - The post data
   * @returns {Promise<object>} - The response from the server
   */
  async updatePostWithImage(postId, body) {
    const response = await axios.put(`/post/image/${postId}`, body);
    return response;
  }

  /**
   * Update a post with a video.
   * @param {string} postId - The post id
   * @param {object} body - The post data
   * @returns {Promise<object>} - The response from the server
   */
  async updatePostWithVideo(postId, body) {
    const response = await axios.put(`/post/video/${postId}`, body);
    return response;
  }

  /**
   * Update a post.
   * @param {string} postId - The post id
   * @param {object} body - The post data
   * @returns {Promise<object>} - The response from the server
   */
  async updatePost(postId, body) {
    const response = await axios.put(`/post/${postId}`, body);
    return response;
  }

  /**
   * Get reactions by username.
   * @param {string} username - The username
   * @returns {Promise<object>} - The response from the server
   */
  async getReactionsByUsername(username) {
    const response = await axios.get(`/post/reactions/username/${username}`);
    return response;
  }

  /**
   * Get post reactions.
   * @param {string} postId - The post id
   * @returns {Promise<object>} - The response from the server
   */
  async getPostReactions(postId) {
    const response = await axios.get(`/post/reactions/${postId}`);
    return response;
  }

  /**
   * Get single post reaction by username.
   * @param {string} postId - The post id
   * @param {string} username - The username
   * @returns {Promise<object>} - The response from the server
   */
  async getSinglePostReactionByUsername(postId, username) {
    const response = await axios.get(`/post/single/reaction/username/${username}/${postId}`);
    return response;
  }

  /**
   * Get post comments names.
   * @param {string} postId - The post id
   * @returns {Promise<object>} - The response from the server
   */
  async getPostCommentsNames(postId) {
    const response = await axios.get(`/post/commentsnames/${postId}`);
    return response;
  }

  /**
   * Get post comments.
   * @param {string} postId - The post id
   * @returns {Promise<object>} - The response from the server
   */
  async getPostComments(postId) {
    const response = await axios.get(`/post/comments/${postId}`);
    return response;
  }

  /**
   * Get posts with images.
   * @param {number} page - The page number
   * @returns {Promise<object>} - The response from the server
   */
  async getPostsWithImages(page) {
    const response = await axios.get(`/post/images/${page}`);
    return response;
  }

  /**
   * Get posts with videos.
   * @param {number} page - The page number
   * @returns {Promise<object>} - The response from the server
   */
  async getPostsWithVideos(page) {
    const response = await axios.get(`/post/videos/${page}`);
    return response;
  }

  /**
   * Add a reaction to a post.
   * @param {object} body - The reaction data
   * @returns {Promise<object>} - The response from the server
   */
  async addReaction(body) {
    const response = await axios.post('/post/reaction', body);
    return response;
  }

  /**
   * Remove a reaction from a post.
   * @param {string} postId - The post id
   * @param {string} previousReaction - The previous reaction
   * @param {array} postReactions - The post reactions
   * @returns {Promise<object>} - The response from the server
   */
  async removeReaction(postId, previousReaction, postReactions) {
    const response = await axios.delete(
      `/post/reaction/${postId}/${previousReaction}/${JSON.stringify(postReactions)}`
    );
    return response;
  }

  /**
   * Add a comment to a post.
   * @param {object} body - The comment data
   * @returns {Promise<object>} - The response from the server
   */
  async addComment(body) {
    const response = await axios.post('/post/comment', body);
    return response;
  }

  /**
   * Delete a post.
   * @param {string} postId - The post id
   * @returns {Promise<object>} - The response from the server
   */
  async deletePost(postId) {
    const response = await axios.delete(`/post/${postId}`);
    return response;
  }
}

export const postService = new PostService();
