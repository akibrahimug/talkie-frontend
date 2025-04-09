/* eslint-disable no-unused-vars */
import Avatar from '@components/avatar/Avatar';
import { timeAgo } from '@services/utils/timeago.utils.service';
import PropTypes from 'prop-types';
import { FAIcon } from '@components/icons';
import { find } from 'lodash';
import { feelingsList, privacyList, bgColors } from '@services/utils/static.data';
import '@components/posts/post/post.scss';
import PostCommentSection from '@components/posts/post-comment-section/postCommentSection';
import { useDispatch, useSelector } from 'react-redux';
// import ReactionsModal from '@components/posts/reactions/reactions-modal/ReactionsModal';
import { Utils } from '@services/utils/utils.service';
import useLocalStorage from '@hooks/useLocalStorage';
import CommentInputBox from '@components/posts/comments/comment-input/CommentInputBox';
import { useState, useEffect, lazy, Suspense, useRef, useCallback } from 'react';
import ImageModal from '@components/image-modal/ImageModal';
import { openModal, toggleDeleteDialog, toggleReactionsModal } from '@redux/reducers/modal/modal.reducer';
import { clearPostData, updatePostItem } from '@redux/reducers/post/post.reducer';
import Dialog from '@components/dialog/Dialog';
import { postService } from '@services/api/post/post.service';
import { ImageUtils } from '@services/utils/image.utils.service';
import Icon from '@components/icons';
import Button from '@components/button/Button';
import { PostUtils } from '@services/utils/post.utils.service';
import SelectDropdown from '@components/select-dropdown/selectDropdown';
import useDetectOutsideClick from '@hooks/useDetectOutsideClick';

// Lazy load the ReactionsModal component
const LazyReactionsModal = lazy(() => import('@components/posts/reactions/reactions-modal/ReactionsModal'));

const Post = ({ post, showIcons }) => {
  const { _id } = useSelector((state) => state.post);
  const { reactionsModalIsOpen, deleteDialogIsOpen } = useSelector((state) => state.modal);
  const { profile } = useSelector((state) => state.user);
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [backgroundImageColor, setBackgroundImageColor] = useState('');
  const selectedPostId = useLocalStorage('selectedPostId', 'get');
  const dispatch = useDispatch();
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);
  const settingsDropdownRef = useRef(null);

  // Keep a local copy of the post data to ensure we maintain all fields
  const [localPost, setLocalPost] = useState(post);

  // Add state for inline editing
  const [isEditing, setIsEditing] = useState(false);
  const [editedPost, setEditedPost] = useState({
    post: '',
    bgColor: '',
    privacy: '',
    feelings: '',
    gifUrl: '',
    image: '',
    video: '',
    originalProfilePicture: '',
    originalAvatarColor: '',
    originalUsername: ''
  });
  const [postText, setPostText] = useState('');
  const [selectedPrivacy, setSelectedPrivacy] = useState(null);
  const privacyRef = useRef(null);
  const [togglePrivacy, setTogglePrivacy] = useDetectOutsideClick(privacyRef, false);
  const textareaRef = useRef(null);
  const [charCount, setCharCount] = useState(100);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper function to ensure post data always has valid user information
  const ensureCompletePostData = (postData) => {
    if (!postData) return null;

    // Create a clean copy
    const cleanPost = { ...postData };

    // If this post belongs to the current user (matching username),
    // ensure it has the current user's profile data
    if (cleanPost.username === profile?.username) {
      // Use the profile data for the display when this is the current user's post
      cleanPost.profilePicture = profile.profilePicture;
      cleanPost.avatarColor = profile.avatarColor;
    }

    // For any missing fields, provide fallbacks
    if (!cleanPost.profilePicture) {
      console.log('Profile picture missing, using fallback');
      // If we have username but no avatar, use avatar generator
      if (cleanPost.username && cleanPost.avatarColor) {
        cleanPost.profilePicture = ''; // Empty string will make Avatar component use initials
      } else {
        // Absolute fallback - use whatever we can find
        cleanPost.profilePicture = profile?.profilePicture || '';
        cleanPost.avatarColor = cleanPost.avatarColor || profile?.avatarColor || '#ffffff';
        cleanPost.username = cleanPost.username || profile?.username || 'User';
      }
    }

    return cleanPost;
  };

  // Update local post when prop changes, ensuring complete data
  useEffect(() => {
    if (post) {
      console.log('Post prop updated:', post);
      const completePost = ensureCompletePostData(post);
      setLocalPost(completePost);
    }
  }, [post, profile]);

  const getFeeling = (name) => {
    const feeling = find(feelingsList, (data) => data.name === name);
    return feeling?.icon;
  };

  const getPrivacy = (type) => {
    const privacy = find(privacyList, (data) => data.topText === type);
    return privacy?.icon;
  };

  const deletePost = async () => {
    try {
      const response = await postService.deletePost(_id);
      if (response) {
        Utils.dispatchNotification(dispatch, response.data.message, 'success');
        dispatch(toggleDeleteDialog({ toggle: !deleteDialogIsOpen }));
        // dispatch(clearPostData());
      }
    } catch (error) {
      Utils.dispatchNotification(dispatch, error.response.data.message, 'error');
    }
  };

  // Update to transform post into editable mode
  const openPostModal = () => {
    try {
      // Log the data before we start editing to debug
      console.log('Opening edit mode with post data:', localPost);
      console.log('Profile picture before edit:', localPost.profilePicture);

      // Set initial values for editing - do NOT include _id in editedPost
      setEditedPost({
        post: localPost.post || '',
        bgColor: localPost.bgColor || '#ffffff',
        privacy: localPost.privacy || 'Public',
        feelings: localPost.feelings || '',
        gifUrl: localPost.gifUrl || '',
        image: localPost.imgId ? Utils.getImage(localPost.imgId, localPost.imgVersion) : '',
        video: localPost.videoId ? Utils.getVideo(localPost.videoId, localPost.videoVersion) : '',
        // Store these for reference, though we use profile data in edit mode UI
        originalProfilePicture: localPost.profilePicture,
        originalAvatarColor: localPost.avatarColor,
        originalUsername: localPost.username
      });

      setPostText(localPost.post || '');
      setCharCount(100 - (localPost.post?.length || 0));

      // Find the privacy setting
      const privacySetting = find(privacyList, (item) => item.topText === localPost.privacy) || privacyList[0];
      setSelectedPrivacy(privacySetting);

      // Set toggle to false initially
      setTogglePrivacy(false);

      // Enable edit mode
      setIsEditing(true);
      setShowSettingsDropdown(false);

      // Focus the textarea after a brief delay to ensure it's rendered
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
        }
      }, 100);
    } catch (error) {
      console.error('Error setting up edit mode:', error);
      Utils.dispatchNotification(dispatch, 'Failed to enter edit mode. Please try again.', 'error');
    }
  };

  const openDeleteDialog = () => {
    dispatch(toggleDeleteDialog({ toggle: !deleteDialogIsOpen }));
    dispatch(updatePostItem(localPost));
  };

  // Handle errors with ReactionsModal
  const handleReactionsModalError = () => {
    console.error('Error loading ReactionsModal');
    dispatch(toggleReactionsModal(false));
    Utils.dispatchNotification(dispatch, 'Could not load reactions. Please try again.', 'error');
  };

  const getBackgroundImageColor = async (postData) => {
    if (!postData) return;

    let imageUrl = '';
    if (postData?.imgId && !postData?.gifUrl && postData.bgColor === '#ffffff') {
      imageUrl = Utils.getImage(postData.imgId, postData.imgVersion);
    } else if (postData?.gifUrl && postData.bgColor === '#ffffff') {
      imageUrl = postData?.gifUrl;
    }
    const bgColor = await ImageUtils.getBackgroundImageColor(imageUrl);
    setBackgroundImageColor(bgColor);
  };

  useEffect(() => {
    getBackgroundImageColor(localPost);
  }, [localPost]);

  /**
   * @description Toggles the settings dropdown
   * @returns {void}
   */
  const toggleSettingsDropdown = () => {
    setShowSettingsDropdown(!showSettingsDropdown);
  };

  /**
   * @description Closes the settings dropdown when clicking outside
   * @param {Event} event - The click event
   * @returns {void}
   */
  const handleClickOutside = useCallback((event) => {
    if (settingsDropdownRef.current && !settingsDropdownRef.current.contains(event.target)) {
      setShowSettingsDropdown(false);
    }

    if (privacyRef.current && !privacyRef.current.contains(event.target)) {
      setTogglePrivacy(false);
    }
  }, []);

  // Add event listener for clicking outside the dropdown
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);

  // Handle text change in edit mode
  const handleTextChange = (e) => {
    const text = e.target.value;
    if (text.length <= 100) {
      setPostText(text);
      setCharCount(100 - text.length);
      setEditedPost({ ...editedPost, post: text });
    }
  };

  // Toggle privacy dropdown - update to match postForm
  const togglePrivacyDropdown = () => {
    setTogglePrivacy(!togglePrivacy);
  };

  // Select privacy - simplified to match postForm pattern
  const handleSelectPrivacy = (privacy) => {
    setSelectedPrivacy(privacy);
    setEditedPost({ ...editedPost, privacy: privacy.topText });
  };

  // Select background color
  const selectBackgroundColor = (color) => {
    setEditedPost({ ...editedPost, bgColor: color });
  };

  // Cancel edit mode
  const cancelEditing = () => {
    setIsEditing(false);
  };

  // Save edits with improved handling
  const saveEdits = async () => {
    try {
      setIsSubmitting(true);

      // Check if the post text is empty
      if (!postText.trim()) {
        Utils.dispatchNotification(dispatch, 'Post text cannot be empty', 'error');
        setIsSubmitting(false);
        return;
      }

      // Log the current state before update
      console.log('Before update - Local post:', localPost);
      console.log('Before update - Profile picture:', localPost.profilePicture);

      // Prepare data for API - match the format expected by the backend
      const updatedPost = {
        post: postText,
        bgColor: editedPost.bgColor,
        privacy: editedPost.privacy || 'Public',
        feelings: editedPost.feelings,
        gifUrl: editedPost.gifUrl
      };

      // Handle image and video separately based on what we're updating
      // Don't send empty strings for these fields as it can cause API issues
      if (editedPost.image) {
        const imageData = editedPost.image.includes('data:image')
          ? editedPost.image // It's a base64 image
          : null; // It's a URL to an existing image, don't change

        if (imageData) {
          updatedPost.image = imageData;
        }
      }

      if (editedPost.video) {
        const videoData = editedPost.video.includes('data:video')
          ? editedPost.video // It's a base64 video
          : null; // It's a URL to an existing video, don't change

        if (videoData) {
          updatedPost.video = videoData;
        }
      }

      console.log('Sending update data to API:', updatedPost);

      // Call API to update post
      const response = await postService.updatePost(localPost._id, updatedPost);

      if (response && response.data) {
        Utils.dispatchNotification(dispatch, 'Post updated successfully', 'success');

        // Create a complete post object with all the necessary fields to prevent any data loss
        let updatedPostData = {
          // First, preserve ALL existing fields from the original post
          ...localPost,

          // Then update the fields that were edited
          post: postText,
          bgColor: editedPost.bgColor,
          privacy: editedPost.privacy || 'Public',
          feelings: editedPost.feelings,
          gifUrl: editedPost.gifUrl,

          // If API returned updated fields for media, update those too
          ...(response.data.post?.imgId && { imgId: response.data.post.imgId }),
          ...(response.data.post?.imgVersion && { imgVersion: response.data.post.imgVersion }),
          ...(response.data.post?.videoId && { videoId: response.data.post.videoId }),
          ...(response.data.post?.videoVersion && { videoVersion: response.data.post.videoVersion })
        };

        // CRITICAL: Force avatar data to be preserved
        updatedPostData.profilePicture = localPost.profilePicture || profile.profilePicture;
        updatedPostData.avatarColor = localPost.avatarColor || profile.avatarColor;
        updatedPostData.username = localPost.username || profile.username;
        updatedPostData.userId = localPost.userId || profile._id;

        // Run through our cleaner to ensure all data is complete
        updatedPostData = ensureCompletePostData(updatedPostData);

        // Log the final post data to help with debugging
        console.log('After update - Updated post data:', updatedPostData);
        console.log('After update - Profile picture preserved:', updatedPostData.profilePicture);

        // First update our local state
        setLocalPost(updatedPostData);

        // Then update Redux
        dispatch(updatePostItem(updatedPostData));

        // Exit edit mode
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating post:', error);
      Utils.dispatchNotification(
        dispatch,
        error?.response?.data?.message || 'Failed to update post. Please try again.',
        'error'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get avatar props based on whether post belongs to current user
  const getAvatarProps = () => {
    // If this is current user's post, use profile data directly
    if (localPost?.username === profile?.username) {
      return {
        name: profile.username,
        bgColor: profile.avatarColor,
        avatarSrc: profile.profilePicture
      };
    }

    // Otherwise use post data
    return {
      name: localPost?.username,
      bgColor: localPost?.avatarColor,
      avatarSrc: localPost?.profilePicture
    };
  };

  // Helper function to debug user avatar issues
  // const debugUserAvatar = (stage) => {
  //   console.log(`[${stage}] Avatar Check - Post username:`, localPost?.username);
  //   console.log(`[${stage}] Avatar Check - Post profilePicture:`, localPost?.profilePicture);
  //   console.log(`[${stage}] Avatar Check - Post avatarColor:`, localPost?.avatarColor);
  //   console.log(`[${stage}] Avatar Check - Profile username:`, profile?.username);
  //   console.log(`[${stage}] Avatar Check - Profile profilePicture:`, profile?.profilePicture);
  //   console.log(`[${stage}] Avatar Check - Profile avatarColor:`, profile?.avatarColor);
  // };

  // Debug on render
  // useEffect(() => {
  //   debugUserAvatar('Render');
  // }, [localPost]);

  // Get the avatar props once for use in the JSX
  const avatarProps = getAvatarProps();

  return (
    <>
      {reactionsModalIsOpen && (
        <Suspense fallback={<div className="modal-loading">Loading reactions...</div>}>
          <LazyReactionsModal />
        </Suspense>
      )}
      {showImageModal && (
        <ImageModal image={`${imageUrl}`} onCancel={() => setShowImageModal(!showImageModal)} showArrow={false} />
      )}
      {deleteDialogIsOpen && (
        <Dialog
          title="Are you sure you want to delete this post?"
          firstButtonText="Delete"
          secondButtonText="Cancel"
          firstBtnHandler={() => deletePost()}
          secondBtnHandler={() => {
            dispatch(toggleDeleteDialog({ toggle: !deleteDialogIsOpen }));
            // dispatch(clearPostData());
          }}
        />
      )}
      <div className="post-body" data-testid="post">
        {/* Settings button - only show if post belongs to current user and not in edit mode */}
        {localPost?.username === profile?.username && !isEditing && (
          <div className="settings-dropdown-container" ref={settingsDropdownRef}>
            <div className="settings-button" onClick={toggleSettingsDropdown}>
              <Icon name="DotsThree" className="settings-icon" weight="bold" />
            </div>
            {showSettingsDropdown && (
              <div className="settings-dropdown">
                <div className="dropdown-item" onClick={openPostModal}>
                  <Icon name="PencilSimple" className="dropdown-icon" weight="regular" />
                  <span>Edit Post</span>
                </div>
                <div className="dropdown-item delete" onClick={openDeleteDialog}>
                  <Icon name="Trash" className="dropdown-icon" weight="regular" />
                  <span>Delete Post</span>
                </div>
              </div>
            )}
          </div>
        )}

        {isEditing ? (
          // Edit mode view
          <div className="post-edit-mode">
            <div className="post-edit-header">
              <h2>Edit Post</h2>
              <button className="cancel-button" onClick={cancelEditing}>
                <Icon name="X" weight="bold" />
              </button>
            </div>

            <div className="user-info">
              <Avatar
                name={profile?.username}
                bgColor={profile?.avatarColor}
                textColor="#ffffff"
                size={50}
                avatarSrc={profile?.profilePicture}
              />

              <div className="user-info-content">
                <div className="user-info-details">
                  <div
                    className={`privacy-display ${togglePrivacy ? 'active' : ''}`}
                    onClick={togglePrivacyDropdown}
                    data-testid="privacy-dropdown"
                    ref={privacyRef}>
                    <span className="privacy-icon">{selectedPrivacy?.icon}</span>
                    <span className="privacy-text">{selectedPrivacy?.topText}</span>
                    <span className="dropdown-arrow">▼</span>
                  </div>
                  <SelectDropdown
                    isActive={togglePrivacy}
                    items={privacyList}
                    setSelectedItem={handleSelectPrivacy}
                    parentRef={privacyRef}
                    updateRedux={false}
                  />
                </div>
              </div>
            </div>

            <div className="post-edit-content" style={{ backgroundColor: editedPost.bgColor }}>
              <textarea
                ref={textareaRef}
                value={postText}
                onChange={handleTextChange}
                placeholder="What's on your mind?"
                className="post-input"
                style={{
                  backgroundColor: editedPost.bgColor === '#ffffff' ? '#ffffff' : 'transparent',
                  color: editedPost.bgColor === '#ffffff' ? 'var(--black-1)' : '#ffffff'
                }}
              />

              {/* {editedPost.image && (
                <div className="image-preview">
                  <img src={editedPost.image} alt="Post" />
                  <button className="remove-media" onClick={() => setEditedPost({ ...editedPost, image: '' })}>
                    <Icon name="X" weight="bold" />
                  </button>
                </div>
              )} */}

              {/* {editedPost.gifUrl && (
                <div className="image-preview">
                  <img src={editedPost.gifUrl} alt="GIF" />
                  <button className="remove-media" onClick={() => setEditedPost({ ...editedPost, gifUrl: '' })}>
                    <Icon name="X" weight="bold" />
                  </button>
                </div>
              )} */}

              {editedPost.video && (
                <div className="video-preview">
                  <video controls src={editedPost.video}></video>
                  <button className="remove-media" onClick={() => setEditedPost({ ...editedPost, video: '' })}>
                    <Icon name="X" weight="bold" />
                  </button>
                </div>
              )}
            </div>

            <div className="color-selector">
              {bgColors.map((color) => (
                <div
                  key={color}
                  className={`color-option ${editedPost.bgColor === color ? 'active' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => selectBackgroundColor(color)}></div>
              ))}
              <div className="char-counter">{charCount}/100</div>
            </div>

            <div className="post-edit-actions">
              <Button label="Cancel" className="cancel-btn" disabled={isSubmitting} handleClick={cancelEditing} />
              <Button
                label={isSubmitting ? 'Saving...' : 'Save'}
                className="save-btn"
                disabled={isSubmitting || postText.trim().length === 0}
                handleClick={saveEdits}
              />
            </div>
          </div>
        ) : (
          // Normal view mode
          <div className="user-post-data">
            <div className="user-post-data-wrap">
              <div className="user-post-image">
                {/* Use the directly calculated avatar props */}
                <Avatar
                  name={avatarProps.name}
                  bgColor={avatarProps.bgColor}
                  textColor="#ffffff"
                  size={50}
                  avatarSrc={avatarProps.avatarSrc}
                />
              </div>
              <div className="user-post-info">
                <div className="inline-title-display">
                  <h5 data-testid="username">
                    {localPost?.username}
                    {localPost?.feelings && (
                      <div className="inline-display" data-testid="inline-display">
                        <span>is feeling</span>
                        <span className="feeling-icon">{getFeeling(localPost?.feelings)}</span>
                        <span className="feeling-name">{localPost?.feelings}</span>
                      </div>
                    )}
                  </h5>
                  {showIcons && (
                    <div className="post-icons" data-testid="post-icons">
                      <FAIcon icon="FaPencilAlt" className="pencil" onClick={openPostModal} />
                      <FAIcon icon="FaRegTrashAlt" className="trash" onClick={openDeleteDialog} />
                    </div>
                  )}
                </div>

                {localPost?.createdAt && (
                  <p className="time-text-display" data-testid="time-display">
                    {timeAgo.transform(localPost?.createdAt)} &middot; {getPrivacy(localPost?.privacy)}
                  </p>
                )}
              </div>
              <hr />
              <div className="user-post" style={{ marginTop: '1rem', borderBottom: '' }}>
                {localPost?.post && localPost?.bgColor === '#ffffff' && (
                  <p className="post" data-testid="user-post">
                    {localPost?.post}
                  </p>
                )}
                {localPost?.post && localPost?.bgColor !== '#ffffff' && (
                  <div
                    data-testid="user-post-with-bg"
                    className="user-post-with-bg"
                    style={{ backgroundColor: `${localPost?.bgColor}` }}>
                    {localPost?.post}
                  </div>
                )}

                {localPost?.imgId && !localPost?.gifUrl && localPost.bgColor === '#ffffff' && (
                  <div
                    data-testid="post-image"
                    className="image-display-flex"
                    style={{ height: '600px', backgroundColor: `${backgroundImageColor}` }}
                    onClick={() => {
                      setImageUrl(Utils.getImage(localPost.imgId, localPost.imgVersion));
                      setShowImageModal(!showImageModal);
                    }}>
                    <img
                      className="post-image"
                      style={{ objectFit: 'contain' }}
                      src={`${Utils.getImage(localPost.imgId, localPost.imgVersion)}`}
                      alt=""
                    />
                  </div>
                )}

                {localPost?.videoId && localPost.bgColor === '#ffffff' && (
                  <div
                    data-testid="post-image"
                    className="image-display-flex"
                    style={{ height: '600px', backgroundColor: '#000000' }}>
                    <video
                      width="100%"
                      height="600px"
                      autoPlay={true}
                      controls
                      src={`${Utils.getVideo(localPost.videoId, localPost.videoVersion)}`}
                    />
                  </div>
                )}

                {localPost?.gifUrl && localPost.bgColor === '#ffffff' && (
                  <div
                    className="image-display-flex"
                    style={{ height: '600px', backgroundColor: `${backgroundImageColor}` }}
                    onClick={() => {
                      setImageUrl(localPost?.gifUrl);
                      setShowImageModal(!showImageModal);
                    }}>
                    <img className="post-image" style={{ objectFit: 'contain' }} src={`${localPost?.gifUrl}`} alt="" />
                  </div>
                )}
                {(localPost?.reactions?.length > 0 || localPost?.commentsCount > 0) && <hr />}
                <PostCommentSection post={localPost} />
              </div>
            </div>
            {selectedPostId === localPost?._id && <CommentInputBox post={localPost} />}
          </div>
        )}
      </div>
    </>
  );
};
Post.propTypes = {
  post: PropTypes.object.isRequired,
  showIcons: PropTypes.bool
};
export default Post;
