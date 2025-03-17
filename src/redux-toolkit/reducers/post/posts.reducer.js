import { getPosts } from '@redux/api/posts';
import { createSlice } from '@reduxjs/toolkit';

/**
 * Initial state for the posts slice.
 * @type {object}
 */
const initialState = {
  posts: [],
  totalPostsCount: 0,
  isLoading: false
};

/**
 * Posts slice for handling posts state.
 * @type {Slice}
 */
const postsSlice = createSlice({
  name: 'allPosts',
  initialState,
  reducers: {
    /**
     * Add posts to the state.
     * @param {object} state - The state
     * @param {object} action - The action
     */
    addToPosts: (state, action) => {
      state.posts = [...action.payload];
    }
  },
  extraReducers: (builder) => {
    /**
     * Handle pending getPosts action.
     * @param {object} state - The state
     */
    builder.addCase(getPosts.pending, (state) => {
      state.isLoading = true;
    });
    /**
     * Handle fulfilled getPosts action.
     * @param {object} state - The state
     * @param {object} action - The action
     */
    builder.addCase(getPosts.fulfilled, (state, action) => {
      state.isLoading = false;
      const { posts, totalPosts } = action.payload;
      state.posts = [...posts];
      state.totalPostsCount = totalPosts;
    });
    /**
     * Handle rejected getPosts action.
     * @param {object} state - The state
     */
    builder.addCase(getPosts.rejected, (state) => {
      state.isLoading = false;
    });
  }
});

export const { addToPosts } = postsSlice.actions;
export default postsSlice.reducer;
