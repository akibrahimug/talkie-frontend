import { createSlice } from '@reduxjs/toolkit';

/**
 * Initial state for the user slice.
 * @type {object}
 */
const initialState = {
  token: '',
  profile: null
};

/**
 * User slice for handling user state.
 * @type {Slice}
 */
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    /**
     * Add user.
     * @param {object} state - The state
     * @param {object} action - The action
     */
    addUser: (state, action) => {
      const { token, profile } = action.payload;
      state.token = token;
      state.profile = profile;
    },
    /**
     * Clear user.
     * @param {object} state - The state
     */
    clearUser: (state) => {
      state.token = '';
      state.profile = null;
    },
    /**
     * Update user profile.
     * @param {object} state - The state
     * @param {object} action - The action
     */
    updateUserProfile: (state, action) => {
      state.profile = action.payload;
    }
  }
});

export const { addUser, clearUser, updateUserProfile } = userSlice.actions;
export default userSlice.reducer;
