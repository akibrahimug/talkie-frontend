import { createSlice } from '@reduxjs/toolkit';
import { getSuggestions } from '@redux/api/suggestions';
const initialState = {
  isLoading: false,
  users: []
};

const suggestionsSlice = createSlice({
  name: 'suggestions',
  initialState,
  reducers: {
    addToSuggestions: (state, action) => {
      const { users, isLoading } = action.payload;
      state.users = [...users];
      state.isLoading = isLoading;
    }
  },
  // create extra reducers for async actions [[pending, fulfilled, rejected]]
  extraReducers: (builder) => {
    builder.addCase(getSuggestions.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getSuggestions.fulfilled, (state, action) => {
      state.isLoading = false;
      const { users } = action.payload;
      state.users = [...users];
    });
    builder.addCase(getSuggestions.rejected, (state) => {
      state.isLoading = false;
    });
  }
});

export const { addToSuggestions } = suggestionsSlice.actions;
export default suggestionsSlice.reducer;
