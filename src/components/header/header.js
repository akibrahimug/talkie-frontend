import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '@assets/images/logo.svg';
import { FaCaretDown, FaCaretUp, FaRegBell, FaRegEnvelope } from 'react-icons/fa';
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

  const backgroundColor = `${env === 'DEV' ? '#50b5ff' : env === 'STG' ? '#e9710f' : ''}`;

  const navigate = useNavigate();
  const openChatPage = () => {};
  const onMarkAsRead = () => {};
  const onDeleteNotification = () => {};
  const onLogout = async () => {
    try {
      setLoggedIn(false);
      Utils.clearStore({ dispatch, deleteStorageUsername, deleteSessionPayload, setLoggedIn });
      await userService.logoutUser();
      navigate('/');
    } catch (error) {
      console.log(error);
    }
  };
  useEffectOnce(() => {
    Utils.mapSettingsDropdownItems(setSettings);
  }, []);

  useEffect(() => {
    const enviroment = Utils.appEnviroment();
    setEnv(enviroment);
  }, []);

  return (
    <>
      {!profile ? (
        <HeaderSkeleton />
      ) : (
        <div className="header-nav-wrapper" data-testid="header-wrapper">
          {isMessagesActive && (
            <div ref={messagesRef}>
              <MessageSidebar
                profile={profile}
                messageCount={0}
                messageNotifications={[]}
                openChatPage={openChatPage}
              />
            </div>
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
                onClick={() => {
                  setIsMessagesActive(false);
                  setIsNotificationsActive(true);
                  setIsSettingsActive(false);
                }}>
                <span className="header-list-name">
                  <FaRegBell className="header-list-icon" />
                  <span className="bg-danger-dots dots" data-testid="notification-dots">
                    5
                  </span>
                </span>
                {isNotificationsActive && (
                  <ul
                    className="dropdown-ul"
                    ref={notificationsRef}
                    style={{ left: '-7vw', '@media (min-width: 1024px)': { left: '-20vw' } }}>
                    <li className="dropdown-li">
                      <Dropdown
                        data={[]}
                        notificationCount={0}
                        title="Notifications"
                        height={300}
                        onMarkAsRead={onMarkAsRead}
                        onDeleteNotification={onDeleteNotification}
                        style={{
                          width: '600px',
                          top: '25px'
                        }}
                      />
                    </li>
                  </ul>
                )}
                &nbsp;
              </li>
              <li
                data-testid="message-list-item"
                className="header-nav-item active-item"
                onClick={() => {
                  setIsMessagesActive(true);
                  setIsNotificationsActive(false);
                  setIsSettingsActive(false);
                }}>
                <span className="header-list-name">
                  <FaRegEnvelope className="header-list-icon" />
                  <span className="bg-danger-dots dots" data-testid="messages-dots"></span>
                </span>
                &nbsp;
              </li>
              <li
                data-testid="settings-list-item"
                className="header-nav-item"
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
                    <FaCaretDown className="header-list-icon caret" />
                  ) : (
                    <FaCaretUp className="header-list-icon caret" />
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
