import { createSlice } from '@reduxjs/toolkit';
import checkIcon from '@assets/images/check.svg';
import errorIcon from '@assets/images/error.svg';
import infoIcon from '@assets/images/info.svg';
import warningIcon from '@assets/images/warning.svg';
import { cloneDeep, uniqBy } from 'lodash';
import { socketService } from '@services/sockets/socket.service';

/**
 * Initial state for the notification slice.
 * @type {Array}
 */
const initialState = [];
let list = [];
const toastIcons = [
  { success: checkIcon, backgroundColor: '#5cb85c' },
  { error: errorIcon, backgroundColor: '#d9534f' },
  { info: infoIcon, backgroundColor: '#5bc0de' },
  { warning: warningIcon, backgroundColor: '#f0ad4e' }
];
/**
 * Notification slice for handling notification state.
 * @type {Slice}
 */
const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    /**
     * Add notification.
     * @param {object} state - The state
     * @param {object} action - The action
     */
    addNotification: (state, action) => {
      const { message, type } = action.payload;
      const toast = toastIcons.find((toast) => toast[type]);
      const toastItem = {
        id: state.length,
        description: message,
        type,
        icon: toast[type],
        backgroundColor: toast.backgroundColor
      };
      list = cloneDeep(list);
      list.unshift(toastItem);

      list = [...uniqBy(list, 'description')];

      // Emit socket refresh event for non-error/info notifications
      if (socketService?.socket && type !== 'error' && type !== 'info') {
        socketService.socket.emit('refresh notification', {
          userTo: socketService.socket.id
        });
      }

      return list;
    },
    /**
     * Clear notification.
     * @param {object} state - The state
     */
    clearNotification: () => {
      list = [];
      return list;
    }
  }
});

export const { addNotification, clearNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
