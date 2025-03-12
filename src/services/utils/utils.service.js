import { addNotification, clearNotification } from '@redux/reducers/notifications/notification.reducer';
import { addUser, clearUser } from '@redux/reducers/user/user.reducer';
// import { APP_ENVIRONMENT } from '@services/axios';
import { avatarColors } from '@services/utils/static.data';
import { floor, random, some, findIndex } from 'lodash';
import millify from 'millify';

/**
 * Utility class for various helper functions.
 */
export class Utils {
  /**
   * Get a random avatar color.
   * @returns {string} - The avatar color
   */
  static avatarColor() {
    return avatarColors[floor(random(0.9) * avatarColors.length)];
  }

  /**
   * Generate an avatar image from a text.
   * @param {string} text - The text to generate the avatar from
   * @param {string} backgroundColor - The background color of the avatar
   * @param {string} forgroundColor - The foreground color of the avatar
   * @returns {string} - The avatar image
   */
  static generateAvatar(text, backgroundColor, forgroundColor = 'white') {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    canvas.width = 200;
    canvas.height = 200;

    context.fillStyle = backgroundColor;
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Draw text

    context.font = 'normal 80px sans-serif';
    context.fillStyle = forgroundColor;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(text, canvas.width / 2, canvas.height / 2);

    return canvas.toDataURL('image/png');
  }

  /**
   * Dispatch user data to the store.
   * @param {object} result - The result object containing user data
   * @param {function} pageReload - The function to reload the page
   * @param {function} dispatch - The dispatch function
   * @param {function} setUser - The function to set the user
   */
  static dispatchUser(result, pageReload, dispatch, setUser) {
    pageReload(true);
    dispatch(
      addUser({
        token: result.data.token,
        profile: result.data.user
      })
    );
    setUser(result.data.user);
  }

  /**
   * Clear the store and delete the user data.
   * @param {function} dispatch - The dispatch function
   * @param {function} deleteStorageUsername - The function to delete the storage username
   * @param {function} deleteSessionPayload - The function to delete the session payload
   * @param {function} setLoggedIn - The function to set the logged in state
   */
  static clearStore({ dispatch, deleteStorageUsername, deleteSessionPayload, setLoggedIn }) {
    dispatch(clearUser());
    dispatch(clearNotification());
    deleteStorageUsername();
    deleteSessionPayload();
    setLoggedIn(false);
  }

  /**
   * Dispatch a notification to the store.
   * @param {function} dispatch - The dispatch function
   * @param {string} message - The message to display
   * @param {string} type - The type of notification
   */
  static dispatchNotification(dispatch, message, type) {
    dispatch(addNotification({ message, type }));
  }

  /**
   * Clear the notification from the store.
   * @param {function} dispatch - The dispatch function
   */
  static dispatchClearNotification(dispatch) {
    dispatch(clearNotification());
  }

  /**
   * Get the environment of the application.
   * @returns {string} - The environment
   */
  static appEnviroment() {
    const env = process.env.REACT_APP_ENVIROMENT;
    if (env === 'development') {
      return 'DEV';
    } else if (env === 'staging') {
      return 'STG';
    }
  }

  /**
   * Map settings dropdown items.
   * @param {function} setSettings - The function to set the settings
   * @returns {array} - The mapped settings
   */
  static mapSettingsDropdownItems(setSettings) {
    const items = [];
    const item = {
      topText: 'My Profile',
      subText: 'View your profile'
    };
    items.push(item);
    setSettings(items);
    return items;
  }

  /**
   * Get the image URL from the cloudinary.
   * @param {string} version - The version of the image
   * @param {string} id - The id of the image
   * @returns {string} - The image URL
   */
  static appImageUrl(version, id) {
    if (typeof version === 'string' && typeof id === 'string') {
      version = version.replace(/['"]+/g, '');
      id = id.replace(/['"]+/g, '');
    }
    return `https://res.cloudinary.com/doyg3ppyn/image/upload/v${version}/${id}`;
  }

  /**
   * Generate a random string of a given length.
   * @param {number} length - The length of the string to generate
   * @returns {string} - The generated string
   */
  static generateString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = ' ';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  /**
   * Check if a user is blocked.
   * @param {array} blocked - The list of blocked users
   * @param {string} userId - The id of the user
   * @returns {boolean} - Whether the user is blocked
   */
  static checkIfUserIsBlocked(blocked, userId) {
    return some(blocked, (id) => id === userId);
  }

  /**
   * Check if a user is followed.
   * @param {array} userFollowers - The list of user followers
   * @param {string} postCreatorId - The id of the post creator
   * @param {string} userId - The id of the user
   * @returns {boolean} - Whether the user is followed
   */
  static checkIfUserIsFollowed(userFollowers, postCreatorId, userId) {
    return some(userFollowers, (user) => user._id === postCreatorId || postCreatorId === userId);
  }

  /**
   * Check if a user is online.
   * @param {string} username - The username of the user
   * @param {array} onlineUsers - The list of online users
   * @returns {boolean} - Whether the user is online
   */
  static checkIfUserIsOnline(username, onlineUsers) {
    return some(onlineUsers, (user) => user === username?.toLowerCase());
  }

  /**
   * Convert the first letter of a word to uppercase.
   * @param {string} word - The word to convert
   * @returns {string} - The converted word
   */
  static firstLetterUpperCase(word) {
    if (!word) return '';
    return `${word.charAt(0).toUpperCase()}${word.slice(1)}`;
  }

  /**
   * Format the reactions.
   * @param {object} reactions - The reactions object
   * @returns {array} - The formatted reactions
   */
  static formattedReactions(reactions) {
    const postReactions = [];
    for (const [key, value] of Object.entries(reactions)) {
      if (value > 0) {
        const reactionObject = {
          type: key,
          value
        };
        postReactions.push(reactionObject);
      }
    }
    return postReactions;
  }

  /**
   * Shorten large numbers.
   * @param {number} data - The number to shorten
   * @returns {string} - The shortened number
   */
  static shortenLargeNumbers(data) {
    if (data === undefined) {
      return 0;
    } else {
      return millify(data);
    }
  }

  /**
   * Get the image URL.
   * @param {string} imageId - The id of the image
   * @param {string} imageVersion - The version of the image
   * @returns {string} - The image URL
   */
  static getImage(imageId, imageVersion) {
    return imageId && imageVersion ? this.appImageUrl(imageVersion, imageId) : '';
  }

  /**
   * Get the video URL.
   * @param {string} videoId - The id of the video
   * @param {string} videoVersion - The version of the video
   * @returns {string} - The video URL
   */
  static getVideo(videoId, videoVersion) {
    return videoId && videoVersion
      ? `https://res.cloudinary.com/dyamr9ym3/video/upload/v${videoVersion}/${videoId}`
      : '';
  }

  /**
   * Remove a user from a list.
   * @param {array} list - The list of users
   * @param {string} userId - The id of the user
   * @returns {array} - The updated list
   */
  static removeUserFromList(list, userId) {
    const index = findIndex(list, (id) => id === userId);
    list.splice(index, 1);
    return list;
  }

  /**
   * Check if a URL contains a specific word.
   * @param {string} url - The URL to check
   * @param {string} word - The word to check for
   * @returns {boolean} - Whether the URL contains the word
   */
  static checkUrl(url, word) {
    return url.includes(word);
  }

  /**
   * Rename a file.
   * @param {object} element - The file element
   * @returns {object} - The renamed file
   */
  static renameFile(element) {
    const fileName = element.name.split('.').slice(0, -1).join('.');
    const blob = element.slice(0, element.size, '/image/png');
    const newFile = new File([blob], `${fileName}.png`, { type: '/image/png' });
    return newFile;
  }
}
