import { clearPost, updatePostItem } from '@redux/reducers/post/post.reducer';

/**
 * Utility class for handling comment-related operations.
 */
export class CommentUtils {
  /**
   * Safely handles comment operations ensuring media data is completely cleared from Redux
   * @param {object} post - The post object
   * @param {function} dispatch - The Redux dispatch function
   * @param {function} callback - Optional callback after comment operation
   */
  static handleCommentOperation(post, dispatch, callback) {
    // Step 1: First explicitly clear all media fields
    dispatch(
      updatePostItem({
        gifUrl: '',
        image: '',
        video: '',
        imgId: '',
        imgVersion: '',
        videoId: '',
        videoVersion: ''
      })
    );

    // Step 2: Completely clear the post data
    dispatch(clearPost());

    // Step 3: Short timeout to ensure clearing has completed
    setTimeout(() => {
      // Again explicitly clear all media fields
      dispatch(
        updatePostItem({
          gifUrl: '',
          image: '',
          video: '',
          imgId: '',
          imgVersion: '',
          videoId: '',
          videoVersion: ''
        })
      );

      // Step 4: Only then update with minimal data
      if (post) {
        const minimalPostData = {
          _id: post._id,
          userId: post.userId,
          commentsCount: post.commentsCount || 0,
          // Explicitly set media fields to empty
          gifUrl: '',
          image: '',
          video: '',
          imgId: '',
          imgVersion: '',
          videoId: '',
          videoVersion: ''
        };

        dispatch(updatePostItem(minimalPostData));
      }

      // Step 5: Execute callback if provided
      if (callback && typeof callback === 'function') {
        callback();
      }
    }, 10);

    // Step 6: One final clear after a delay to catch any race conditions
    setTimeout(() => {
      dispatch(
        updatePostItem({
          gifUrl: '',
          image: '',
          video: '',
          imgId: '',
          imgVersion: '',
          videoId: '',
          videoVersion: ''
        })
      );
    }, 100);
  }
}
