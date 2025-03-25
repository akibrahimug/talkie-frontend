import { useDispatch, useSelector } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import { ImageUtils } from '@services/utils/image.utils.service';
import { PostUtils } from '@services/utils/post.utils.service';
import { postService } from '@services/api/post/post.service';
import { toggleGifModal } from '@redux/reducers/modal/modal.reducer';
import { openModal } from '@redux/reducers/modal/modal.reducer';
import Spinner from '@components/spinner/spinner';
import AddPost from '@components/posts/post-modal/post-add/add-post';
import '@components/posts/post-form/postForm.scss';
import Giphy from '@components/giphy/giphy';
import { FaGlobe } from 'react-icons/fa';
import Avatar from '@components/avatar/Avatar';
import SelectDropdown from '@components/select-dropdown/selectDropdown';
import useDetectOutsideClick from '@hooks/useDetectOutsideClick';
import { privacyList } from '@services/utils/static.data';
import { find } from 'lodash';

// Import our newly created components
import PostHeader from '@components/posts/post-form/post-header/PostHeader';
import TextInput from '@components/posts/post-form/text-input/TextInput';
import FeelingDisplay from '@components/posts/post-form/feeling-display/FeelingDisplay';
import FeelingsPicker from '@components/posts/post-form/feelings-picker/FeelingsPicker';
import MediaPreview from '@components/posts/post-form/media-preview/MediaPreview';
import ColorPicker from '@components/posts/post-form/color-picker/ColorPicker';
import PostActions from '@components/posts/post-form/post-actions/PostActions';

const PostForm = () => {
  const { profile } = useSelector((state) => state.user);
  const { type, isOpen, gifModalIsOpen } = useSelector((state) => state.modal);
  const postState = useSelector((state) => state.post) || {};
  const { gifUrl, image, privacy, video, feeling: postFeeling } = postState;

  // Local state for expandable form
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasVideo, setHasVideo] = useState(false);
  const [postImage, setPostImage] = useState('');
  const [postText, setPostText] = useState('');
  const [selectedColor, setSelectedColor] = useState('#ffffff');
  const [selectedPostImage, setSelectedPostImage] = useState();
  const [selectedPostVideo, setSelectedPostVideo] = useState();
  const [userFeeling, setUserFeeling] = useState(null);
  const [showFeelingsPicker, setShowFeelingsPicker] = useState(false);
  const [isGif, setIsGif] = useState(false);
  const [postData, setPostData] = useState({
    post: '',
    bgColor: selectedColor,
    privacy: '',
    feelings: '',
    gifUrl: '',
    profilePicture: '',
    image: '',
    video: ''
  });

  // State for GIF picker visibility
  const [isGifPickerVisible, setIsGifPickerVisible] = useState(false);

  // Add state for privacy
  const privacyRef = useRef(null);
  const [selectedPrivacy, setSelectedPrivacy] = useState({
    topText: 'Public',
    subText: 'Anyone on Talkie',
    icon: <FaGlobe className="globe-icon globe" />
  });
  const [togglePrivacy, setTogglePrivacy] = useDetectOutsideClick(privacyRef, false);

  // Refs
  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const containerRef = useRef(null);
  const counterRef = useRef(null);
  const dispatch = useDispatch();

  const maxCharCount = 100;

  // Close form when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target) && isExpanded) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded]);

  // Update image state when props change
  useEffect(() => {
    if (gifUrl) {
      setPostImage(gifUrl);
      setHasVideo(false);
      setIsGif(true);
      setSelectedColor('#ffffff'); // Reset color when GIF is added
      setPostData({ ...postData, bgColor: '#ffffff', gifUrl });
    } else if (image) {
      setPostImage(image);
      setHasVideo(false);
      setIsGif(false);
    } else if (video) {
      setHasVideo(true);
      setPostImage(video);
      setIsGif(false);
    }
  }, [gifUrl, image, video]);

  // Update the useEffect - add privacy display logic
  useEffect(() => {
    if (privacy) {
      const postPrivacy = find(privacyList, (data) => data.topText === privacy);
      if (postPrivacy) {
        setSelectedPrivacy(postPrivacy);
      }
    }
  }, [privacy]);

  // Handle expanding the form
  const handleFocus = () => {
    setIsExpanded(true);
  };

  // Handle text changes
  const handleTextChange = (e) => {
    const text = e.target.value;

    // Update character counter
    if (counterRef.current) {
      counterRef.current.textContent = `${maxCharCount - text.length}/${maxCharCount}`;
    }

    // Limit text to maxCharCount
    if (text.length <= maxCharCount) {
      setPostText(text);
      setPostData({ ...postData, post: text });
    }
  };

  // Handle image file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate the file
    ImageUtils.checkFile(file, 'image');

    // Set the local state without clearing the text
    setSelectedPostImage(file);

    // Reset background color to white when adding an image
    setSelectedColor('#ffffff');
    setPostData({ ...postData, bgColor: '#ffffff' });

    // Read and preview the image
    const reader = new FileReader();
    reader.onload = (e) => {
      setPostImage(e.target.result);
    };
    reader.readAsDataURL(file);

    setIsExpanded(true);
  };

  // Handle video file selection
  const handleVideoFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate the file
    ImageUtils.checkFile(file, 'video');

    // Set the local state without clearing the text
    setSelectedPostVideo(file);
    setHasVideo(true);

    // Reset background color to white when adding a video
    setSelectedColor('#ffffff');
    setPostData({ ...postData, bgColor: '#ffffff' });

    // Read and preview the video
    const reader = new FileReader();
    reader.onload = (e) => {
      setPostImage(e.target.result);
    };
    reader.readAsDataURL(file);

    setIsExpanded(true);
  };

  // Select a feeling
  const selectFeeling = (feeling) => {
    setUserFeeling(feeling);
    setShowFeelingsPicker(false);
    setPostData({ ...postData, feelings: feeling });
  };

  // Handle media removal
  const handleMediaRemove = () => {
    setPostImage('');
    setSelectedPostImage(null);
    setSelectedPostVideo(null);
    setHasVideo(false);
    setIsGif(false);
    setPostData({ ...postData, gifUrl: '', image: '', video: '' });
  };

  // Handle color select - should disable color selection if there's media
  const handleColorSelect = (color) => {
    // Only allow color selection if there's no media
    if (!postImage) {
      setSelectedColor(color);
      setPostData({ ...postData, bgColor: color });
    }
  };

  // Open file dialog for image
  const openImageModal = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
    setIsExpanded(true);
  };

  // Open file dialog for video
  const openVideoModal = () => {
    if (videoInputRef.current) {
      videoInputRef.current.click();
    }
    setIsExpanded(true);
  };

  // Modified to toggle the GIF picker visibility within the form
  const openGifModal = () => {
    setIsExpanded(true);
    setIsGifPickerVisible(!isGifPickerVisible);
    // Close feelings picker if open
    setShowFeelingsPicker(false);
  };

  // Open feelings component
  const openFeelingsComponent = () => {
    setIsExpanded(true);
    setShowFeelingsPicker(true);
  };

  // Function to handle GIF selection
  const updateGif = (gifUrl) => {
    setPostImage(gifUrl);
    setIsGif(true);
    setSelectedColor('#ffffff');
    setPostData({
      ...postData,
      gifUrl,
      bgColor: '#ffffff'
    });
    setIsGifPickerVisible(false);
  };

  // Create a post
  const createPost = async () => {
    setLoading(true);

    try {
      // Prepare post data
      let data = {
        ...postData,
        post: postText,
        bgColor: selectedColor,
        privacy: privacy || 'Public',
        profilePicture: profile?.profilePicture,
        feelings: userFeeling || postFeeling?.name || ''
      };

      // Handle media uploads
      if (postImage || selectedPostImage || selectedPostVideo) {
        let result = '';
        if (selectedPostImage) {
          result = await ImageUtils.readAsBase64(selectedPostImage);
        }

        if (selectedPostVideo) {
          result = await ImageUtils.readAsBase64(selectedPostVideo);
        }

        const type = selectedPostImage || !hasVideo ? 'image' : 'video';
        if (type === 'image') {
          data.image = result || postImage;
          data.video = '';
        } else {
          data.video = result || postImage;
          data.image = '';
        }

        await PostUtils.sendPostWithFileRequest(
          type,
          data,
          null, // We don't need to pass textareaRef here since we're using a component
          setApiResponse,
          setLoading,
          setDisable,
          dispatch
        );
      } else {
        await postService.createPost(data);
      }

      // Reset form after successful post
      resetForm();
    } catch (error) {
      console.error('Error creating post:', error);
      PostUtils.dispatchNotification(
        error.response?.data?.message || 'Error creating post',
        'error',
        setApiResponse,
        setLoading,
        dispatch
      );
    }
  };

  // Reset form state
  const resetForm = () => {
    setPostText('');
    setSelectedColor('#ffffff');
    setPostImage('');
    setHasVideo(false);
    setIsExpanded(false);
    setLoading(false);
    setUserFeeling(null);
    setShowFeelingsPicker(false);
    setSelectedPostImage(null);
    setSelectedPostVideo(null);
    setPostData({
      post: '',
      bgColor: '#ffffff',
      privacy: '',
      feelings: '',
      gifUrl: '',
      profilePicture: '',
      image: '',
      video: ''
    });

    if (counterRef.current) {
      counterRef.current.textContent = `${maxCharCount}/${maxCharCount}`;
    }
  };

  const setApiResponse = () => {
    // This function is used by the PostUtils.dispatchNotification method
  };

  const setDisable = () => {
    // This function is used by the PostUtils.sendPostWithFileRequest method
  };

  return (
    <div className="post-form-container" ref={containerRef} data-testid="post-form">
      <div className="post-form">
        <PostHeader title="Create Post" />

        <div
          className={`post-form-content ${selectedColor !== '#ffffff' && !postImage ? 'with-bg' : ''}`}
          style={{ backgroundColor: postImage ? 'transparent' : selectedColor }}>
          <div className="post-form-user-info">
            <div className="user-info-container">
              <Avatar
                name={profile?.username}
                bgColor={profile?.avatarColor}
                textColor="#ffffff"
                size={50}
                avatarSrc={profile?.profilePicture}
              />
              <div className="user-info-content">
                <div className="user-info-details">
                  {userFeeling && (
                    <div className="user-feeling-display">
                      is feeling <span>{userFeeling}</span>
                      <button className="remove-feeling" onClick={() => setUserFeeling(null)}>
                        ×
                      </button>
                    </div>
                  )}

                  <div
                    className={`privacy-display ${togglePrivacy ? 'active' : ''}`}
                    onClick={() => setTogglePrivacy(!togglePrivacy)}
                    data-testid="privacy-dropdown"
                    ref={privacyRef}>
                    <span className="privacy-icon">{selectedPrivacy.icon}</span>
                    <span className="privacy-text">{selectedPrivacy.topText}</span>
                    <span className="dropdown-arrow">▼</span>
                  </div>
                  <SelectDropdown
                    isActive={togglePrivacy}
                    items={privacyList}
                    setSelectedItem={setSelectedPrivacy}
                    parentRef={privacyRef}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="post-form-input-area">
            <div className="text-input-container">
              <TextInput
                profile={profile}
                text={postText}
                onChange={handleTextChange}
                onFocus={handleFocus}
                selectedColor={selectedColor}
                isExpanded={isExpanded}
              />
            </div>

            {postImage && (
              <MediaPreview mediaUrl={postImage} isVideo={hasVideo} isGif={isGif} onRemove={handleMediaRemove} />
            )}
          </div>
        </div>

        {isExpanded && (
          <div className="post-form-expanded-content">
            {loading && (
              <div className="post-form-loading" data-testid="post-form-loading">
                <span>Posting...</span>
                <Spinner />
              </div>
            )}

            <FeelingsPicker
              isVisible={showFeelingsPicker}
              onClose={() => setShowFeelingsPicker(false)}
              onSelect={selectFeeling}
            />

            {isGifPickerVisible && (
              <div className="gif-picker-container">
                <div className="gif-picker-header">
                  <h4>Choose a GIF</h4>
                  <button className="close-gif-picker" onClick={() => setIsGifPickerVisible(false)}>
                    ×
                  </button>
                </div>
                <Giphy handleGifSelection={updateGif} />
              </div>
            )}
          </div>
        )}

        {isExpanded && (
          <div className="post-form-tools">
            <ColorPicker
              selectedColor={selectedColor}
              onColorSelect={handleColorSelect}
              charCount={postText.length}
              maxCharCount={maxCharCount}
              disabled={!!postImage}
            />
          </div>
        )}

        <div className="post-form-footer">
          <PostActions
            refs={{ photoRef: fileInputRef, videoRef: videoInputRef }}
            isExpanded={isExpanded}
            isSubmitDisabled={!postText.length && !postImage}
            onPhotoClick={openImageModal}
            onGifClick={openGifModal}
            onFeelingClick={openFeelingsComponent}
            onVideoClick={openVideoModal}
            onPhotoChange={handleFileChange}
            onVideoChange={handleVideoFileChange}
            onSubmit={createPost}
            privacySetting={selectedPrivacy}
            onPrivacyClick={() => setTogglePrivacy(!togglePrivacy)}
            privacyRef={privacyRef}
            togglePrivacy={togglePrivacy}
            privacyList={privacyList}
            setSelectedPrivacy={setSelectedPrivacy}
          />
        </div>
      </div>

      {isOpen && type === 'add' && (
        <AddPost selectedImage={selectedPostImage} selectedPostVideo={selectedPostVideo} updateGif={updateGif} />
      )}
    </div>
  );
};

export default PostForm;
