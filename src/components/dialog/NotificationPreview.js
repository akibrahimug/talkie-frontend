import Button from '@components/button/Button';
import { reactionsMap } from '@services/utils/static.data';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { NotificationUtils } from '@services/utils/notification.utils.service';

import '@components/dialog/NotificationPreview.scss';

const NotificationPreview = ({
  title,
  post,
  imgUrl,
  comment,
  reaction,
  senderName,
  secondButtonText,
  secondBtnHandler,
  notificationId,
  addToNotifications
}) => {
  // Create a wrapper for the secondBtnHandler to also reset the notification tracking
  const handleClose = () => {
    // Reset tracking for this specific notification if ID is provided
    if (notificationId) {
      NotificationUtils.resetDisplayedNotification(notificationId);
    }

    // Add to notifications section if callback is provided
    if (addToNotifications) {
      addToNotifications();
    }

    // Call the original handler
    if (secondBtnHandler) {
      secondBtnHandler();
    }
  };

  // Auto-dismiss notification after 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, 2000); // 2 seconds

    // Clean up timer when component unmounts
    return () => clearTimeout(timer);
  }, [notificationId, addToNotifications, secondBtnHandler]); // Add dependencies to prevent stale closures

  return (
    <>
      <div className="notification-preview-container" data-testid="notification-preview">
        <div className="dialog">
          <h4>{title}</h4>
          <div className="dialog-body">
            {post && <span className="dialog-body-post">{post}</span>}
            {imgUrl && <img className="dialog-body-img" src={imgUrl} alt="Post content" />}
            {comment && <span className="dialog-body-comment">{comment}</span>}
            {reaction && (
              <div className="dialog-body-reaction" data-testid="reaction">
                <span className="dialog-body-reaction-text">{senderName} reacted on your post with</span>{' '}
                <img className="reaction-img" src={`${reactionsMap[`${reaction}`]}`} alt={`${reaction} reaction`} />
              </div>
            )}
          </div>
          <div className="btn-container">
            <Button className="button cancel-btn" label={secondButtonText} handleClick={handleClose} />
          </div>
        </div>
      </div>
    </>
  );
};

NotificationPreview.propTypes = {
  post: PropTypes.string,
  imgUrl: PropTypes.string,
  title: PropTypes.string,
  comment: PropTypes.string,
  reaction: PropTypes.string,
  senderName: PropTypes.string,
  secondButtonText: PropTypes.string,
  secondBtnHandler: PropTypes.func,
  notificationId: PropTypes.string,
  addToNotifications: PropTypes.func
};

export default NotificationPreview;
