import { createSlice } from '@reduxjs/toolkit';

/**
 * Initial state for the modal slice.
 * @type {object}
 */
const initialState = {
  type: '',
  isOpen: false,
  feelingIsOpen: false,
  deleteDialogIsOpen: false,
  data: null,
  feeling: {},
  gifModalIsOpen: false,
  reactionsModalIsOpen: false,
  commentsModalIsOpen: false,
  feeling: '',
  image: '',
  feelingsIsOpen: false,
  openFileDialog: false,
  openVideoDialog: false
};

/**
 * Modal slice for handling modal state.
 * @type {Slice}
 */
const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    /**
     * Open modal.
     * @param {object} state - The state
     * @param {object} action - The action
     */
    openModal: (state, action) => {
      const { type, data } = action.payload;
      state.isOpen = true;
      state.type = type;
      state.data = data;
    },
    /**
     * Close modal.
     * @param {object} state - The state
     */
    closeModal: (state) => {
      state.isOpen = false;
      state.type = '';
      state.feeling = '';
      state.image = '';
      state.data = null;
      state.feelingsIsOpen = false;
      state.gifModalIsOpen = false;
      state.reactionsModalIsOpen = false;
      state.commentsModalIsOpen = false;
      state.openFileDialog = false;
      state.openVideoDialog = false;
      state.deleteDialogIsOpen = false;
    },
    /**
     * Add post feeling.
     * @param {object} state - The state
     * @param {object} action - The action
     */
    addPostFeeling: (state, action) => {
      const { feeling } = action.payload;
      state.feeling = feeling;
    },
    /**
     * Toggle image modal.
     * @param {object} state - The state
     * @param {object} action - The action
     */
    toggleImageModal: (state, action) => {
      state.openFileDialog = action.payload;
    },
    /**
     * Toggle video modal.
     * @param {object} state - The state
     * @param {object} action - The action
     */
    toggleVideoModal: (state, action) => {
      state.openVideoDialog = action.payload;
    },
    /**
     * Toggle feeling modal.
     * @param {object} state - The state
     * @param {object} action - The action
     */
    toggleFeelingModal: (state, action) => {
      state.feelingsIsOpen = action.payload;
    },
    /**
     * Toggle gif modal.
     * @param {object} state - The state
     * @param {object} action - The action
     */
    toggleGifModal: (state, action) => {
      state.gifModalIsOpen = action.payload;
    },
    /**
     * Toggle reactions modal.
     * @param {object} state - The state
     * @param {object} action - The action
     */
    toggleReactionsModal: (state, action) => {
      state.reactionsModalIsOpen = action.payload;
    },
    /**
     * Toggle comments modal.
     * @param {object} state - The state
     * @param {object} action - The action
     */
    toggleCommentsModal: (state, action) => {
      state.commentsModalIsOpen = action.payload;
    },
    /**
     * Toggle delete dialog.
     * @param {object} state - The state
     * @param {object} action - The action
     */
    toggleDeleteDialog: (state, action) => {
      const { data, toggle } = action.payload;
      state.deleteDialogIsOpen = toggle;
      state.data = data;
    }
  }
});

export const {
  openModal,
  closeModal,
  addPostFeeling,
  toggleImageModal,
  toggleVideoModal,
  toggleFeelingModal,
  toggleGifModal,
  toggleReactionsModal,
  toggleCommentsModal,
  toggleDeleteDialog
} = modalSlice.actions;
export default modalSlice.reducer;
