import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  posts: [],
  totalPostsCount: 0,
  isLoading: false,
  gifUrl: '',
  image: '',
  video: '',
  privacy: 'Public',
  feelings: ''
};

const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    addPost: (state, action) => {
      state.posts = [action.payload, ...state.posts];
    },
    updatePost: (state, action) => {
      state.posts = state.posts.map((post) =>
        post._id === action.payload.postId ? { ...post, ...action.payload.updatedPost } : post
      );
    },
    updatePostItem: (state, action) => {
      state.posts = state.posts.map((post) => (post._id === action.payload.post._id ? action.payload.post : post));
    },
    deletePost: (state, action) => {
      state.posts = state.posts.filter((post) => post._id !== action.payload);
    },
    clearPosts: (state) => {
      state.posts = [];
    },
    setGifUrl: (state, action) => {
      state.gifUrl = action.payload;
    },
    setPostImage: (state, action) => {
      state.image = action.payload;
    },
    setPostVideo: (state, action) => {
      state.video = action.payload;
    },
    setPrivacy: (state, action) => {
      state.privacy = action.payload;
    },
    setFeelings: (state, action) => {
      state.feelings = action.payload;
    },
    setTotalPostsCount: (state, action) => {
      state.totalPostsCount = action.payload;
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    }
  }
});

export const {
  addPost,
  updatePost,
  updatePostItem,
  deletePost,
  clearPosts,
  setGifUrl,
  setPostImage,
  setPostVideo,
  setPrivacy,
  setFeelings,
  setTotalPostsCount,
  setIsLoading
} = postSlice.actions;
export default postSlice.reducer;
