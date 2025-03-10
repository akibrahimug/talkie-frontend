import { createAsyncThunk } from '@reduxjs/toolkit';
import { userService } from '@services/user/user.service';

const getSuggestions = createAsyncThunk('user/getSuggestions', async (name, { dispatch }) => {
  try {
    const response = await userService.getUserSuggestions();
    return response.data;
  } catch (error) {
    console.error('Error fetching user suggestions:', error);
  }
});

export { getSuggestions };
