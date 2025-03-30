import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '@assets/images/logo.svg';
import { FAIcon } from '@components/icons';
import '@components/header/Header.scss';
import Avatar from '@components/avatar/Avatar';
import { Utils } from '@services/utils/utils.service';
import { ProfileUtils } from '@services/utils/profile-utils.service';
import useDetectOutsidelick from '@hooks/useDetectOutsideClick';
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

const Header = () => {
  const { profile } = useSelector((state) => state.user);
  const [settings, setSettings] = useState([]);
  const [env, setEnv] = useState('');
  const messagesRef = useRef(null);
  const notificationsRef = useRef(null);
  const settingsRef = useRef(null);
  const [isMessagesActive, setIsMessagesActive] = useDetectOutsidelick(messagesRef, false);
  const [isNotificationsActive, setIsNotificationsActive] = useDetectOutsidelick(notificationsRef, false);
  const [isSettingsActive, setIsSettingsActive] = useDetectOutsidelick(settingsRef, false);
  const [deleteStorageUsername] = useLocalStorage('username', 'delete');
  const [setLoggedIn] = useLocalStorage('keepLoggedIn', 'delete');
  const [deleteSessionPayload] = useSessionStorage('pageReload', 'delete');
  const dispatch = useDispatch();
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [notificationDialogContent, setNotificationDialogContent] = useState({
    post: '',
    imgUrl: '',
    comment: '',
    reaction: '',
    senderName: ''
  });
  const [storedUsername] = useLocalStorage('username', 'get');

  const backgroundColor = `${env === 'DEV' ? '#50b5ff' : env === 'STG' ? '#e9710f' : ''}`;

  const getUserNotifications = async () => {
    try {
      const response = await notificationsService.getUserNotifications();
      const mappedNotifications = NotificationUtils.mapNotificationDropdownItems(
        response.data.notifications,
        setNotificationCount
      );
      setNotifications(mappedNotifications);
      socketService?.socket.emit('setup', { userId: storedUsername });
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error fetching notifications';
      Utils.dispatchNotification(dispatch, errorMessage, 'error');
    }
  };

  const onMarkAsRead = async (notification) => {
    try {
      await notificationsService.markNotificationAsRead(notification?._id);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error marking notification as read';
      Utils.dispatchNotification(dispatch, errorMessage, 'error');
    }
  };

  const onDeleteNotification = async (messageId) => {
    try {
      await notificationsService.deleteNotification(messageId);
      Utils.dispatchNotification(dispatch, 'Notification deleted successfully', 'success');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error deleting notification';
      Utils.dispatchNotification(dispatch, errorMessage, 'error');
    }
  };

  const navigate = useNavigate();
  const openChatPage = () => {};
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
  useEffectOnce(() => {
    Utils.mapSettingsDropdownItems(setSettings);
    getUserNotifications();
  }, []);

  useEffect(() => {
    const enviroment = Utils.appEnviroment();
    setEnv(enviroment);
  }, []);

  useEffect(() => {
    NotificationUtils.socketIONotification(profile, notifications, setNotifications, 'header', setNotificationCount);
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
              secondButtonText="Close"
              secondBtnHandler={() => {
                setNotificationDialogContent({
                  post: '',
                  imgUrl: '',
                  comment: '',
                  reaction: '',
                  senderName: ''
                });
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
                  {notificationCount > 0 && (
                    <span className="bg-danger-dots dots" data-testid="messages-dots">
                      {notificationCount > 99 ? '99+' : notificationCount}
                    </span>
                  )}
                </span>
                {isMessagesActive && (
                  <ul className="dropdown-ul messages-dropdown-ul" ref={messagesRef}>
                    <li className="dropdown-li">
                      <MessageSidebar
                        profile={profile}
                        messageCount={notificationCount}
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
