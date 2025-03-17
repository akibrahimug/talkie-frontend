import { createAsyncThunk } from '@reduxjs/toolkit';
import { userService } from '@services/user/user.service';

/**
 * Get suggestions.
 * @param {string} name - The name of the suggestion
 * @param {object} dispatch - The dispatch function
 * @returns {Promise<object>} - The response from the server
 */
const getSuggestions = createAsyncThunk('user/getSuggestions', async (name, { dispatch }) => {
  try {
    const response = await userService.getUserSuggestions();
    return response.data;
  } catch (error) {
    console.error('Error fetching user suggestions:', error);
  }
});

export { getSuggestions };
