import { configureStore } from '@reduxjs/toolkit';
import userReducer from '@redux/reducers/user/user.reducer';
import suggestionsReducer from '@redux/reducers/suggestions/suggestions.reducer';
import notificationReducer from '@redux/reducers/notifications/notification.reducer';
import modalReducer from '@redux/reducers/modal/modal.reducer';
import postReducer from '@redux/reducers/post/post.reducer';
import postsReducer from './reducers/post/posts.reducer';
import userPostReactionsReducer from '@redux/reducers/post/user-post-reaction.reducer';
/**
 * Configure the Redux store.
 * @type {Store}
 */
export const store = configureStore({
  reducer: {
    user: userReducer,
    suggestions: suggestionsReducer,
    notifications: notificationReducer,
    modal: modalReducer,
    post: postReducer,
    allPosts: postsReducer,
    userPostReactions: userPostReactionsReducer
  }
});
