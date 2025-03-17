import React, { useRef, useEffect, useState } from 'react';
import '@pages/social/streams/Streams.scss';
import Suggestions from '@components/suggestions/Suggestions';
import { useDispatch, useSelector } from 'react-redux';
import { getSuggestions } from '@redux/api/suggestions';
import PostForm from '@components/posts/post-form/postForm';
import Posts from '@components/posts/posts';
import { Utils } from '@services/utils/utils.service';
import { postService } from '@services/api/post/post.service';
import { FaArrowUp } from 'react-icons/fa';
import useEffectOnce from '@hooks/useEffectOnce';
import { getPosts } from '@redux/api/posts';
import { uniqBy } from 'lodash';
import useInfiniteScroll from '@hooks/useInfiniteScroll';
import { PostUtils } from '@services/utils/post.utils.service';
const Streams = () => {
  const bodyRef = useRef(null);
  const bottomLineRef = useRef();
  const dispatch = useDispatch();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const {
    posts: reduxPosts,
    totalPostsCount: reduxTotalCount,
    isLoading: reduxIsLoading
  } = useSelector((state) => state.allPosts || {});
  const [totalPostsCount, setTotalPostsCount] = useState(0);
  const appPosts = useRef([]);
  useInfiniteScroll(bodyRef, bottomLineRef, fetchPostData);
  const PAGE_SIZE = 10;

  // function declarations can be hoisted
  // pagination
  function fetchPostData() {
    let pageNumber = currentPage;
    if (currentPage <= Math.round(totalPostsCount / PAGE_SIZE)) {
      pageNumber += 1;
      setCurrentPage(pageNumber);
      getAllPosts(pageNumber);
    }
  }

  const getAllPosts = async (pageNumber = currentPage) => {
    try {
      setLoading(true);
      const response = await postService.getAllPosts(pageNumber);
      if (response.data && response.data.posts && response.data.posts.length > 0) {
        appPosts.current = [...(posts || []), ...response.data.posts];
        const uniquePosts = uniqBy(appPosts.current, '_id');
        setPosts(uniquePosts);
        setTotalPostsCount(response.data.totalPosts || 0);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      Utils.dispatchNotification(dispatch, error.response.data.message, 'error');
    }
  };

  useEffectOnce(() => {
    dispatch(getSuggestions());
    // Use Redux action to get initial posts
    dispatch(getPosts());
  });

  // Add back the Redux posts fetching
  useEffect(() => {
    dispatch(getPosts());
  }, [dispatch]);

  useEffect(() => {
    if (reduxPosts && reduxPosts.length > 0) {
      setPosts(reduxPosts);
    }
    if (reduxTotalCount) {
      setTotalPostsCount(reduxTotalCount);
    }
    if (reduxIsLoading !== undefined) {
      setLoading(reduxIsLoading);
    }
  }, [reduxPosts, reduxTotalCount, reduxIsLoading]);

  // Ensure scroll container is properly set up after posts load
  useEffect(() => {
    if (bodyRef.current && !loading && posts && posts.length > 0) {
      bodyRef.current.scrollTop = 0;
    }
  }, [posts, loading]);

  // Handle scroll events to show/hide scroll-to-top button
  const handleScroll = () => {
    if (bodyRef.current) {
      if (bodyRef.current.scrollTop > 300) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    }
  };

  // Add scroll event listener
  useEffect(() => {
    const scrollContainer = bodyRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    if (bodyRef.current) {
      bodyRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  /**
   * Effect to handle socket events for posts.(this is for real time updates)
   */
  useEffect(() => {
    PostUtils.socketIOPost(posts, setPosts);
  }, [posts]);

  return (
    <div className="streams" data-testid="streams">
      <div className="streams-content">
        <div className="streams-post-container">
          {/* Fixed post form at the top */}
          <div className="fixed-post-form">
            <PostForm />
          </div>

          {/* Scrollable posts area */}
          <div className="streams-post" ref={bodyRef}>
            <Posts allPosts={posts || []} userFollowing={[]} postsLoading={loading} />
            {!loading && (!posts || posts.length === 0) && (
              <div className="no-posts">
                <p>No posts to display. Create your first post!</p>
              </div>
            )}
            <div ref={bottomLineRef} style={{ marginBottom: '50px', height: '50px' }}></div>
          </div>

          {showScrollButton && (
            <button
              className="scroll-to-top-button"
              onClick={scrollToTop}
              style={{
                position: 'absolute',
                bottom: '30px',
                right: '30px',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary-1)',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
                zIndex: 10
              }}>
              <FaArrowUp />
            </button>
          )}
        </div>
        <div className="streams-suggestions">
          <Suggestions />
        </div>
      </div>
    </div>
  );
};

export default Streams;
