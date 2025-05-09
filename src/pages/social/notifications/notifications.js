import { useState, useEffect } from 'react';
import Avatar from '@components/avatar/Avatar';
import '@pages/social/notifications/notifications.scss';
import { FaCircle, FaRegCircle, FaRegTrashAlt } from 'react-icons/fa';
import { Utils } from '@services/utils/utils.service';
import { useDispatch, useSelector } from 'react-redux';
import { notificationsService } from '@services/api/notications/notifications.service';
import useEffectOnce from '@hooks/useEffectOnce';
import { NotificationUtils } from '@services/utils/notification.utils.service';
import NotificationPreview from '@components/dialog/NotificationPreview';
import { timeAgo } from '@services/utils/timeago.utils.service';
import { socketService } from '@services/sockets/socket.service';

const Notification = () => {
  const { profile } = useSelector((state) => state.user);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentNotificationId, setCurrentNotificationId] = useState('');
  const [notificationDialogContent, setNotificationDialogContent] = useState({
    post: '',
    imgUrl: '',
    comment: '',
    reaction: '',
    senderName: ''
  });
  const dispatch = useDispatch();

  const getUserNotifications = async () => {
    try {
      const response = await notificationsService.getUserNotifications();
      setNotifications(response.data.notifications);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      const errorMessage = error.response?.data?.message || 'Error fetching notifications';
      Utils.dispatchNotification(dispatch, errorMessage, 'error');
    }
  };

  const markAsRead = async (notification) => {
    try {
      setCurrentNotificationId(notification?._id);
      NotificationUtils.markMessageAsRead(notification?._id, notification, setNotificationDialogContent);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error marking notification as read';
      Utils.dispatchNotification(dispatch, errorMessage, 'error');
    }
  };

  const deleteNotification = async (event, messageId) => {
    event.stopPropagation();
    try {
      const response = await notificationsService.deleteNotification(messageId);
      Utils.dispatchNotification(dispatch, response.data.message, 'success');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error deleting notification';
      Utils.dispatchNotification(dispatch, errorMessage, 'error');
    }
  };

  // Handle refresh notifications event
  const handleRefreshNotifications = async () => {
    await getUserNotifications();
  };

  useEffectOnce(() => {
    getUserNotifications();
  });

  useEffect(() => {
    NotificationUtils.socketIONotification(profile, notifications, setNotifications, 'notificationPage');

    // Setup socket event listeners for refresh notifications
    if (socketService?.socket) {
      socketService.socket.on('refresh notifications', handleRefreshNotifications);
    }

    // Cleanup function
    return () => {
      if (socketService?.socket) {
        socketService.socket.off('refresh notifications');
      }
    };
  }, [profile, notifications]);

  return (
    <>
      {notificationDialogContent?.senderName && (
        <NotificationPreview
          title="Your post"
          post={notificationDialogContent?.post}
          imgUrl={notificationDialogContent?.imgUrl}
          comment={notificationDialogContent?.comment}
          reaction={notificationDialogContent?.reaction}
          senderName={notificationDialogContent?.senderName}
          notificationId={currentNotificationId}
          secondButtonText="Close"
          addToNotifications={() => {
            console.log('Notification already in list, no need to add');
          }}
          secondBtnHandler={() => {
            setNotificationDialogContent({
              post: '',
              imgUrl: '',
              comment: '',
              reaction: '',
              senderName: ''
            });
            setCurrentNotificationId('');
          }}
        />
      )}
      <div className="notifications-container">
        <div className="notifications">Notifications</div>
        {notifications.length > 0 && (
          <div className="notifications-box">
            {notifications.map((notification) => (
              <div
                className="notification-box"
                data-testid="notification-box"
                key={notification?._id}
                onClick={() => markAsRead(notification)}>
                <div className="notification-box-sub-card">
                  <div className="notification-box-sub-card-media">
                    <div className="notification-box-sub-card-media-image-icon">
                      <Avatar
                        name={notification?.userFrom?.username}
                        bgColor={notification?.userFrom?.avatarColor}
                        textColor="#ffffff"
                        size={40}
                        avatarSrc={notification?.userFrom?.profilePicture}
                      />
                    </div>
                    <div className="notification-box-sub-card-media-body">
                      <h6 className="title">
                        {notification?.message}
                        <small
                          data-testid="subtitle"
                          className="subtitle"
                          onClick={(event) => deleteNotification(event, notification?._id)}>
                          <FaRegTrashAlt className="trash" />
                        </small>
                      </h6>
                      <div className="subtitle-body">
                        <small className="subtitle">
                          {!notification?.read ? <FaCircle className="icon" /> : <FaRegCircle className="icon" />}
                        </small>
                        <p className="subtext">{timeAgo.transform(notification?.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {loading && !notifications.length && <div className="notifications-box"></div>}
        {!loading && !notifications.length && (
          <h3 className="empty-page" data-testid="empty-page">
            You have no notification
          </h3>
        )}
      </div>
    </>
  );
};
export default Notification;
