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
    try {
      console.log('addReaction called with data:', JSON.stringify(body, null, 2));

      // Clone the body to avoid modifying the original
      const sanitizedBody = { ...body };

      // Ensure reaction type is valid
      if (!['like', 'love', 'happy', 'wow', 'sad', 'angry'].includes(sanitizedBody.type)) {
        console.error('Invalid reaction type:', sanitizedBody.type);
        throw new Error(`Invalid reaction type: ${sanitizedBody.type}`);
      }

      // Log the URL and request body
      console.log('Sending POST request to /post/reaction with body:', sanitizedBody);

      const response = await axios.post('/post/reaction', sanitizedBody);
      console.log('addReaction response:', response.status, response.data);
      return response;
    } catch (error) {
      console.error('Error in addReaction:', error?.response?.data || error.message);
      console.error('Failed request details:', {
        url: '/post/reaction',
        method: 'POST',
        data: body
      });

      // Try with a more minimal payload as fallback
      try {
        console.log('Attempting fallback method for adding reaction');
        const minimalBody = {
          postId: body.postId,
          type: body.type,
          userTo: body.userTo
        };

        console.log('Sending minimal POST request to /post/reaction with body:', minimalBody);
        const fallbackResponse = await axios.post('/post/reaction', minimalBody);
        console.log('Fallback addReaction response:', fallbackResponse.status, fallbackResponse.data);
        return fallbackResponse;
      } catch (fallbackError) {
        console.error('Fallback method also failed:', fallbackError?.response?.data || fallbackError.message);
        throw error; // Throw the original error
      }
    }
  }

  /**
   * A simplified method to add a reaction to a post
   * This sends minimal data which helps avoid issues with complex objects
   * @param {string} postId - The post id
   * @param {string} reactionType - The reaction type
   * @param {string} userTo - The user id of the post owner
   * @returns {Promise<object>} - The response from the server
   */
  async addReactionBasic(postId, reactionType, userTo) {
    try {
      console.log('Using simplified addReactionBasic method:', {
        postId,
        reactionType,
        userTo
      });

      // Create a minimal payload with only the essential data
      const minimalBody = {
        postId,
        type: reactionType,
        userTo
      };

      console.log('Sending minimal POST request to /post/reaction with body:', minimalBody);
      const response = await axios.post('/post/reaction', minimalBody);
      console.log('addReactionBasic response:', response.status, response.data);
      return response;
    } catch (error) {
      console.error('Error in addReactionBasic:', error?.response?.data || error.message);

      // Try an alternative endpoint or approach if needed
      try {
        console.log('Attempting alternative method for adding reaction');
        // Construct an alternative URL that might be supported by the backend
        const alternativeUrl = `/post/reaction/${postId}/${reactionType}`;
        console.log('Sending GET request to alternative URL:', alternativeUrl);

        const fallbackResponse = await axios.get(alternativeUrl);
        console.log('Alternative reaction addition successful:', fallbackResponse.status, fallbackResponse.data);
        return fallbackResponse;
      } catch (fallbackError) {
        console.error('All reaction addition methods failed:', fallbackError);
        throw error; // Throw the original error
      }
    }
  }

  /**
   * A simplified method to remove a reaction from a post
   * This sends minimal data which helps avoid issues with complex objects
   * @param {string} postId - The post id
   * @param {string} previousReaction - The previous reaction
   * @returns {Promise<object>} - The response from the server
   */
  async removeReactionBasic(postId, previousReaction) {
    try {
      console.log('Using simplified removeReactionBasic method:', { postId, previousReaction });

      // Use the DELETE endpoint that expects the parameters in the URL
      // This matches the backend route defined in reactions.routes.ts
      const response = await axios.delete(`/post/reaction/${postId}/${previousReaction}`);

      console.log('Successfully removed reaction with DELETE method');
      return response;
    } catch (error) {
      console.error('Error in removeReactionBasic:', error);

      // If the first attempt fails, try with the alternative DELETE endpoint
      try {
        console.log('Attempting alternative method for reaction removal');

        // Try the DELETE endpoint that expects postReactions in the body
        // Create a minimal empty reactions object to satisfy the API
        const emptyReactions = {
          like: 0,
          love: 0,
          happy: 0,
          wow: 0,
          sad: 0,
          angry: 0
        };

        const fallbackResponse = await axios.delete(
          `/post/reaction/${postId}/${previousReaction}/${JSON.stringify(emptyReactions)}`
        );

        console.log('Successfully removed reaction with alternative method');
        return fallbackResponse;
      } catch (fallbackError) {
        console.error('All reaction removal methods failed:', fallbackError);
        throw fallbackError;
      }
    }
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

  /**
   * Remove a reaction from a post.
   * @param {string} postId - The post id
   * @param {string} previousReaction - The previous reaction
   * @param {object} postReactions - The post reactions
   * @returns {Promise<object>} - The response from the server
   */
  async removeReaction(postId, previousReaction, postReactions) {
    // Simply delegate to the more robust basic method
    return this.removeReactionBasic(postId, previousReaction);
  }
}

export const postService = new PostService();
