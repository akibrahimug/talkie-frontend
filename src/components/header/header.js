import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '@assets/images/logo.svg';
import { FAIcon } from '@components/icons';
import '@components/header/Header.scss';
import Avatar from '@components/avatar/Avatar';
import { Utils } from '@services/utils/utils.service';
import { ProfileUtils } from '@services/utils/profile-utils.service';
import useDetectOutsideClick from '@hooks/useDetectOutsideClick';
import MessageSidebar from '@components/message-sidebar/MessageSidebar';
import { useSelector } from 'react-redux';
import Dropdown from '@components/dropdown/Dropdown';
import useEffectOnce from '@hooks/useEffectOnce';
import useLocalStorage from '@hooks/useLocalStorage';
import useSessionStorage from '@hooks/useSessionStorage';
import { useDispatch } from 'react-redux';
import { userService } from '@services/user/user.service';
import HeaderSkeleton from './HeaderSkeleton';
import { notificationsService } from '@services/api/notications/notifications.service';
import { NotificationUtils } from '@services/utils/notification.utils.service';
import NotificationPreview from '@components/dialog/NotificationPreview';
import { socketService } from '@services/sockets/socket.service';
import { chatService } from '@services/api/chat/chat.service';

const Header = () => {
  const { profile } = useSelector((state) => state.user);
  const [settings, setSettings] = useState([]);
  const [env, setEnv] = useState('');
  const messagesRef = useRef(null);
  const notificationsRef = useRef(null);
  const settingsRef = useRef(null);
  const [isMessagesActive, setIsMessagesActive] = useDetectOutsideClick(messagesRef, false);
  const [isNotificationsActive, setIsNotificationsActive] = useDetectOutsideClick(notificationsRef, false);
  const [isSettingsActive, setIsSettingsActive] = useDetectOutsideClick(settingsRef, false);
  const [deleteStorageUsername] = useLocalStorage('username', 'delete');
  const [setLoggedIn] = useLocalStorage('keepLoggedIn', 'delete');
  const [deleteSessionPayload] = useSessionStorage('pageReload', 'delete');
  const dispatch = useDispatch();
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [messageCount, setMessageCount] = useState(0);
  const [currentNotificationId, setCurrentNotificationId] = useState('');
  const [notificationDialogContent, setNotificationDialogContent] = useState({
    post: '',
    imgUrl: '',
    comment: '',
    reaction: '',
    senderName: ''
  });
  const [storedUsername] = useLocalStorage('username', 'get');
  const navigate = useNavigate();

  const backgroundColor = `${env === 'DEV' ? '#50b5ff' : env === 'STG' ? '#e9710f' : ''}`;

  const getUserNotifications = async () => {
    try {
      console.log('Fetching user notifications...');
      const response = await notificationsService.getUserNotifications();
      console.log('Notifications response:', response.data.notifications);

      // Map notification items to dropdown items with proper count calculation
      const mappedNotifications = NotificationUtils.mapNotificationDropdownItems(
        response.data.notifications,
        setNotificationCount
      );

      console.log('Mapped notifications for dropdown:', mappedNotifications);
      setNotifications(mappedNotifications);

      // Setup socket connection
      socketService?.socket?.emit('setup', { userId: storedUsername });
    } catch (error) {
      console.error('Error fetching notifications:', error);
      const errorMessage = error.response?.data?.message || 'Error fetching notifications';
      Utils.dispatchNotification(dispatch, errorMessage, 'error');
    }
  };

  // Get unread messages count from server
  const getUnreadMessages = async () => {
    try {
      // Use our new chat service to get the actual unread count
      const response = await chatService.getUnreadMessagesCount();
      setMessageCount(response?.data?.unreadCount || 0);

      console.log('Unread messages count set to:', response?.data?.unreadCount);

      // Listen for new messages via socket - this is handled in the useEffect where we set up socket listeners
      return () => {
        // No cleanup needed here as it's handled in the useEffect
      };
    } catch (error) {
      console.error('Error fetching unread messages count:', error);
      setMessageCount(0);
      return () => {}; // Return empty function for cleanup
    }
  };

  const onMarkAsRead = async (notification) => {
    try {
      setCurrentNotificationId(notification?._id);
      await NotificationUtils.markMessageAsRead(notification?._id, notification, setNotificationDialogContent);

      const updatedNotifications = notifications.map((item) => {
        if (item._id === notification._id) {
          return { ...item, read: true };
        }
        return item;
      });

      setNotifications(updatedNotifications);

      if (!notification.read) {
        setNotificationCount((prev) => Math.max(0, prev - 1));
      }

      setTimeout(() => {
        setIsNotificationsActive(false);
      }, 500);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error marking notification as read';
      Utils.dispatchNotification(dispatch, errorMessage, 'error');
    }
  };

  const onDeleteNotification = async (messageId) => {
    try {
      await notificationsService.deleteNotification(messageId);

      const updatedNotifications = notifications.filter((item) => item._id !== messageId);
      setNotifications(updatedNotifications);

      const unreadCount = updatedNotifications.filter((item) => !item.read).length;
      setNotificationCount(unreadCount);

      Utils.dispatchNotification(dispatch, 'Notification deleted successfully', 'success');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error deleting notification';
      Utils.dispatchNotification(dispatch, errorMessage, 'error');
    }
  };

  const openChatPage = (messageId) => {
    // In a real implementation, you would navigate to a chat page
    // and send a request to mark the message as read
    console.log('Opening chat for message ID:', messageId);

    // Mark message as read in UI
    setMessageCount((prevCount) => Math.max(0, prevCount - 1));

    // Emit message read event to server
    if (socketService?.socket?.connected && messageId) {
      socketService.socket.emit('message read', { messageId });
    }

    // Navigate to chat page
    navigate('/app/social/chat/messages');
  };

  const navigateToNotificationsPage = () => {
    setIsNotificationsActive(false);
    navigate('/app/social/notifications');
  };

  const onLogout = async () => {
    try {
      setLoggedIn(false);
      Utils.clearStore({ dispatch, deleteStorageUsername, deleteSessionPayload, setLoggedIn });
      await userService.logoutUser();
      navigate('/');
    } catch (error) {
      Utils.dispatchNotification(dispatch, error.response?.data?.message || 'Error logging out', 'error');
    }
  };

  // Handle refresh notifications event
  const handleRefreshNotifications = async () => {
    await getUserNotifications();
  };

  useEffectOnce(() => {
    Utils.mapSettingsDropdownItems(setSettings);
    getUserNotifications();

    // Set environment
    const environment = Utils.appEnviroment();
    setEnv(environment);

    // Get unread messages and store the cleanup function
    const cleanupMessageTimer = getUnreadMessages();

    // Return cleanup function
    return () => {
      // Clean up message timer when component unmounts
      if (cleanupMessageTimer) {
        cleanupMessageTimer();
      }
    };
  }, []);

  useEffect(() => {
    NotificationUtils.socketIONotification(profile, notifications, setNotifications, 'header', setNotificationCount);

    // Setup socket event listeners for refresh notifications
    if (socketService?.socket) {
      socketService.socket.on('refresh notifications', handleRefreshNotifications);

      // Listen for new messages
      socketService.socket.on('new message', (data) => {
        console.log('New message received:', data);
        // Increment message count when new message is received
        setMessageCount((prevCount) => prevCount + 1);
      });

      // Listen for message read events
      socketService.socket.on('message read', (data) => {
        console.log('Message read event:', data);
        // Decrement message count when message is read
        setMessageCount((prevCount) => Math.max(0, prevCount - 1));
      });
    }

    // Cleanup function
    return () => {
      if (socketService?.socket) {
        socketService.socket.off('refresh notifications');
        socketService.socket.off('new message');
        socketService.socket.off('message read');
      }
    };
  }, [profile, notifications]);

  return (
    <>
      {!profile ? (
        <HeaderSkeleton />
      ) : (
        <div className="header-nav-wrapper" data-testid="header-wrapper">
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
                if (currentNotificationId) {
                  const exists = notifications.some((notification) => notification._id === currentNotificationId);
                  if (!exists && Object.values(notificationDialogContent).some((value) => value)) {
                    const newNotification = {
                      _id: currentNotificationId,
                      message: `${notificationDialogContent.senderName} ${
                        notificationDialogContent.reaction
                          ? `reacted with ${notificationDialogContent.reaction}`
                          : notificationDialogContent.comment
                          ? 'commented on your post'
                          : 'interacted with your post'
                      }`,
                      read: true,
                      createdAt: new Date().toISOString(),
                      senderUsername: notificationDialogContent.senderName
                    };

                    // Update notifications array with new notification
                    const updatedNotifications = [newNotification, ...notifications];
                    setNotifications(updatedNotifications);

                    // Recalculate notification count (though this is already read)
                    const unreadCount = updatedNotifications.filter((item) => !item.read).length;
                    setNotificationCount(unreadCount);

                    console.log('Added notification to list:', newNotification);
                  }
                }
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
          <div className="header-navbar">
            <div className="header-image" data-testid="header-image" onClick={() => navigate('/app/social/streams')}>
              <img src={logo} className="img-fluid" alt="" />
              <div className="app-name">
                Talkie
                {env ? (
                  <span className="environment" style={{ backgroundColor: `${backgroundColor}` }}>
                    {env}
                  </span>
                ) : (
                  <></>
                )}
              </div>
            </div>
            <div className="header-menu-toggle">
              <span className="bar"></span>
              <span className="bar"></span>
              <span className="bar"></span>
            </div>
            <ul className="header-nav">
              <li
                data-testid="notification-list-item"
                className="header-nav-item active-item"
                title="Notifications"
                onClick={() => {
                  setIsMessagesActive(false);
                  setIsNotificationsActive(true);
                  setIsSettingsActive(false);
                }}>
                <span className="header-list-name">
                  <FAIcon icon="FaRegBell" className="header-list-icon" />
                  <span className="bg-danger-dots dots" data-testid="notification-dots">
                    {notificationCount > 0 ? (notificationCount > 99 ? '99+' : notificationCount) : '0'}
                  </span>
                </span>
                {isNotificationsActive && (
                  <ul className="dropdown-ul notification-dropdown-ul" ref={notificationsRef}>
                    <li className="dropdown-li">
                      <Dropdown
                        data={notifications}
                        notificationCount={notificationCount}
                        title="Notifications"
                        height={400}
                        onMarkAsRead={onMarkAsRead}
                        onDeleteNotification={onDeleteNotification}
                        onNavigate={navigateToNotificationsPage}
                      />
                    </li>
                  </ul>
                )}
                &nbsp;
              </li>
              <li
                data-testid="message-list-item"
                className="header-nav-item active-item"
                title="Messages"
                onClick={() => {
                  setIsMessagesActive(!isMessagesActive);
                  setIsNotificationsActive(false);
                  setIsSettingsActive(false);
                }}>
                <span className="header-list-name">
                  <FAIcon icon="FaRegEnvelope" className="header-list-icon" />
                  <span className="bg-danger-dots dots" data-testid="messages-dots">
                    {messageCount > 0 ? (messageCount > 99 ? '99+' : messageCount) : '0'}
                  </span>
                </span>
                {isMessagesActive && (
                  <ul className="dropdown-ul messages-dropdown-ul" ref={messagesRef}>
                    <li className="dropdown-li">
                      <MessageSidebar
                        profile={profile}
                        messageCount={messageCount}
                        messageNotifications={[]}
                        openChatPage={openChatPage}
                      />
                    </li>
                  </ul>
                )}
                &nbsp;
              </li>
              <li
                data-testid="settings-list-item"
                className="header-nav-item"
                title="Account"
                onClick={() => {
                  setIsMessagesActive(false);
                  setIsNotificationsActive(false);
                  setIsSettingsActive(!isSettingsActive);
                }}>
                <span className="header-list-name profile-image">
                  <Avatar
                    name={profile?.username}
                    bgColor={profile?.avartaColr}
                    textColor="#ffffff"
                    size={40}
                    avatarSrc={profile?.profilePicture}
                  />
                </span>
                <span className="header-list-name profile-name">
                  {profile?.username}
                  {isSettingsActive ? (
                    <FAIcon icon="FaCaretDown" className="header-list-icon caret" />
                  ) : (
                    <FAIcon icon="FaCaretUp" className="header-list-icon caret" />
                  )}
                </span>
                {isSettingsActive && (
                  <ul className="dropdown-ul settings-dropdown" ref={settingsRef}>
                    <li className="dropdown-li">
                      <Dropdown
                        data={settings}
                        classNames={['settings-dropdown', 'notification-dropdown']}
                        notificationCount={0}
                        title="Settings"
                        height={300}
                        onLogout={onLogout}
                        onNavigate={() => ProfileUtils.navigateToProfile(profile, navigate)}
                      />
                    </li>
                  </ul>
                )}
              </li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
};
export default Header;
