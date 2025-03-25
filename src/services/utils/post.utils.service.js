import { closeModal } from '@redux/reducers/modal/modal.reducer';
import { clearPost, updatePostItem } from '@redux/reducers/post/post.reducer';
import { postService } from '@services/api/post/post.service';
import { socketService } from '@services/sockets/socket.service';
import { Utils } from '@services/utils/utils.service';
import { cloneDeep, find, findIndex, remove } from 'lodash';

/**
 * Utility class for handling post-related operations.
 */
export class PostUtils {
  /**
   * Select a background color for the post.
   * @param {string} bgColor - The background color
   * @param {object} postData - The post data
   * @param {function} setTextAreaBackground - The function to set the text area background
   * @param {function} setPostData - The function to set the post data
   */
  static selectBackground(bgColor, postData, setTextAreaBackground, setPostData) {
    postData.bgColor = bgColor;
    setTextAreaBackground(bgColor);
    setPostData(postData);
  }

  /**
   * Set the post input to editable.
   * @param {string} textContent - The text content
   * @param {object} postData - The post data
   * @param {function} setPostData - The function to set the post data
   */
  static postInputEditable(textContent, postData, setPostData) {
    postData.post = textContent;
    setPostData(postData);
  }

  /**
   * Close the post modal.
   * @param {function} dispatch - The dispatch function
   */
  static closePostModal(dispatch) {
    dispatch(closeModal());
    dispatch(clearPost());
  }

  /**
   * Clear the image data for the post.
   * @param {object} postData - The post data
   * @param {object} post - The post object
   * @param {object} inputRef - The input reference
   * @param {function} dispatch - The dispatch function
   * @param {function} setSelectedPostImage - The function to set the selected post image
   * @param {function} setPostImage - The function to set the post image
   * @param {function} setPostData - The function to set the post data
   */
  static clearImage(postData, post, inputRef, dispatch, setSelectedPostImage, setPostImage, setPostData) {
    postData.gifUrl = '';
    postData.image = '';
    postData.video = '';
    setSelectedPostImage(null);
    setPostImage('');
    setTimeout(() => {
      if (inputRef?.current) {
        inputRef.current.textContent = !post ? postData?.post : post;
        if (post) {
          postData.post = post;
        }
        setPostData(postData);
      }
      PostUtils.positionCursor('editable');
    });
    dispatch(
      updatePostItem({ gifUrl: '', image: '', imgId: '', imgVersion: '', video: '', videoId: '', videoVersion: '' })
    );
  }

  /**
   * Set the post input data.
   * @param {object} imageInputRef - The image input reference
   * @param {object} postData - The post data
   * @param {object} post - The post object
   * @param {function} setPostData - The function to set the post data
   */
  static postInputData(imageInputRef, postData, post, setPostData) {
    setTimeout(() => {
      if (imageInputRef?.current) {
        imageInputRef.current.textContent = !post ? postData?.post : post;
        if (post) {
          postData.post = post;
        }
        setPostData(postData);
        PostUtils.positionCursor('editable');
      }
    });
  }

  /**
   * Dispatch a notification.
   * @param {string} message - The message
   * @param {string} type - The type
   * @param {function} setApiResponse - The function to set the API response
   * @param {function} setLoading - The function to set the loading state
   * @param {function} dispatch - The dispatch function
   */
  static dispatchNotification(message, type, setApiResponse, setLoading, dispatch) {
    setApiResponse(type);
    setLoading(false);
    Utils.dispatchNotification(dispatch, message, type);
  }

  /**
   * Send a post with file request.
   * @param {string} type - The type
   * @param {object} postData - The post data
   * @param {object} imageInputRef - The image input reference
   * @param {function} setApiResponse - The function to set the API response
   * @param {function} setLoading - The function to set the loading state
   * @param {function} dispatch - The dispatch function
   */
  static async sendPostWithFileRequest(type, postData, imageInputRef, setApiResponse, setLoading, dispatch) {
    try {
      if (imageInputRef?.current) {
        imageInputRef.current.textContent = postData.post;
      }
      const response =
        type === 'image'
          ? await postService.createPostWithImage(postData)
          : await postService.createPostWithVideo(postData);
      if (response) {
        setApiResponse('success');
        setLoading(false);
      }
    } catch (error) {
      PostUtils.dispatchNotification(error.response.data.message, 'error', setApiResponse, setLoading, dispatch);
    }
  }

  /**
   * Send an update post with file request.
   * @param {string} type - The type
   * @param {string} postId - The post id
   * @param {object} postData - The post data
   * @param {function} setApiResponse - The function to set the API response
   * @param {function} setLoading - The function to set the loading state
   * @param {function} dispatch - The dispatch function
   */
  static async sendUpdatePostWithFileRequest(type, postId, postData, setApiResponse, setLoading, dispatch) {
    try {
      const response =
        type === 'image'
          ? await postService.updatePostWithImage(postId, postData)
          : await postService.updatePostWithVideo(postId, postData);
      if (response) {
        PostUtils.dispatchNotification(response.data.message, 'success', setApiResponse, setLoading, dispatch);
        setTimeout(() => {
          setApiResponse('success');
          setLoading(false);
        }, 3000);
        PostUtils.closePostModal(dispatch);
      }
    } catch (error) {
      PostUtils.dispatchNotification(error.response.data.message, 'error', setApiResponse, setLoading, dispatch);
    }
  }

  /**
   * Send an update post request.
   * @param {string} postId - The post id
   * @param {object} postData - The post data
   * @param {function} setApiResponse - The function to set the API response
   * @param {function} setLoading - The function to set the loading state
   * @param {function} dispatch - The dispatch function
   */
  static async sendUpdatePostRequest(postId, postData, setApiResponse, setLoading, dispatch) {
    const response = await postService.updatePost(postId, postData);
    if (response) {
      PostUtils.dispatchNotification(response.data.message, 'success', setApiResponse, setLoading, dispatch);
      setTimeout(() => {
        setApiResponse('success');
        setLoading(false);
      }, 3000);
      PostUtils.closePostModal(dispatch);
    }
  }

  /**
   * Check if the post is private, public, or followers.
   * @param {object} post - The post object
   * @param {object} profile - The profile object
   * @param {array} following - The list of following users
   * @returns {boolean} - Whether the post is private, public, or followers
   */
  static checkPrivacy(post, profile, following) {
    const isPrivate = post?.privacy === 'Private' && post?.userId === profile?._id;
    const isPublic = post?.privacy === 'Public';
    const isFollower =
      post?.privacy === 'Followers' && Utils.checkIfUserIsFollowed(following, post?.userId, profile?._id);
    return isPrivate || isPublic || isFollower;
  }

  /**
   * Position the cursor in the post input.
   * @param {string} elementId - The id of the element
   */
  static positionCursor(elementId) {
    const element = document.getElementById(`${elementId}`);
    const selection = window.getSelection();
    const range = document.createRange();
    selection.removeAllRanges();
    range.selectNodeContents(element);
    range.collapse(false);
    selection.addRange(range);
    element.focus();
  }

  /**
   * Handle socket events for posts.
   * @param {array} posts - The list of posts
   * @param {function} setPosts - The function to set the posts
   */
  static socketIOPost(posts, setPosts) {
    posts = cloneDeep(posts);
    socketService?.socket?.on('add post', (post) => {
      posts = [post, ...posts];
      setPosts(posts);
    });

    socketService?.socket?.on('update post', (post) => {
      PostUtils.updateSinglePost(posts, post, setPosts);
    });

    socketService?.socket?.on('delete post', (postId) => {
      const index = findIndex(posts, (postData) => postData._id === postId);
      if (index > -1) {
        posts = cloneDeep(posts);
        remove(posts, { _id: postId });
        setPosts(posts);
      }
    });

    socketService?.socket?.on('update like', (reactionData) => {
      const postData = find(posts, (post) => post._id === reactionData?.postId);
      if (postData) {
        postData.reactions = reactionData.postReactions;
        PostUtils.updateSinglePost(posts, postData, setPosts);
      }
    });

    socketService?.socket?.on('update comment', (commentData) => {
      const postData = find(posts, (post) => post._id === commentData?.postId);
      if (postData) {
        postData.commentsCount = commentData.commentsCount;
        PostUtils.updateSinglePost(posts, postData, setPosts);
      }
    });
  }

  /**
   * Update a single post in the list of posts.
   * @param {array} posts - The list of posts
   * @param {object} post - The post object
   * @param {function} setPosts - The function to set the posts
   */
  static updateSinglePost(posts, post, setPosts) {
    posts = cloneDeep(posts);
    const index = findIndex(posts, ['_id', post?._id]);
    if (index > -1) {
      posts.splice(index, 1, post);
      setPosts(posts);
    }
  }
}
