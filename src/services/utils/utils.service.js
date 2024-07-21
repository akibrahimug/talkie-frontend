import { floor, random } from 'lodash';
import { avatarColors } from '@services/utils/static.data';
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
    context.fillReact(0, 0, canvas.width, canvas.height);

    // draw text
    context.font = 'normal 80px sans-serif';
    context.fillStyle = forgroundColor;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(text, canvas.width / 2, canvas.height / 2);

    return canvas.toDataURL('image/png');
  }
}
