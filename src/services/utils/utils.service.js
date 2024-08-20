import { floor, random } from 'lodash';
import { avatarColors } from '@services/utils/static.data';
import { addUser, clearUser } from '@redux/reducers/user/user.reducer';
export class Utils {
  static avatarColor() {
    return avatarColors[floor(random(0.9) * avatarColors.length)];
  }

  // username first letter
  static generateAvatar(text, backgroundColor, forgroundColor = 'white') {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    canvas.width = 200;
    canvas.height = 200;

    context.fillStyle = backgroundColor;
    context.fillRect(0, 0, canvas.width, canvas.height);

    // draw text
    context.font = 'normal 80px sans-serif';
    context.fillStyle = forgroundColor;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(text, canvas.width / 2, canvas.height / 2);

    return canvas.toDataURL('image/png');
  }

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

  static clearStore({ dispatch, deleteStorageUsername, deleteSessionPayload, setLoggedIn }) {
    dispatch(clearUser());
    // dispatch clear notificationaction
    deleteStorageUsername();
    deleteSessionPayload();
    setLoggedIn(false);
  }

  static appEnviroment() {
    const env = process.env.REACT_APP_ENVIROMENT;
    if (env === 'development') {
      return 'DEV';
    } else if (env === 'staging') {
      return 'STG';
    }
  }
}
