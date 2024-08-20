import { useState, useEffect } from 'react';
import logo from '@assets/images/logo.svg';
import { FaCaretDown, FaRegBell, FaRegEnvelope } from 'react-icons/fa';
import '@components/header/Header.scss';
import Avatar from '@components/avatar/Avatar';
import { Utils } from '@services/utils/utils.service';

const Header = () => {
  const [env, setEnv] = useState('');
  const backgroundColor = `${env === 'DEV' ? '#50b5ff' : env === 'STG' ? '#e9710f' : ''}`;

  useEffect(() => {
    const enviroment = Utils.appEnviroment();
    setEnv(enviroment);
  }, []);
  return (
    <>
      <div className="header-nav-wrapper" data-testid="header-wrapper">
        <div className="header-navbar">
          <div className="header-image" data-testid="header-image">
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
            <li className="header-nav-item active-item">
              <span className="header-list-name">
                <FaRegBell className="header-list-icon" />
                <span className="bg-danger-dots dots" data-testid="notification-dots">
                  5
                </span>
              </span>
              <ul className="dropdown-ul">
                <li className="dropdown-li"></li>
              </ul>
              &nbsp;
            </li>
            <li className="header-nav-item active-item">
              <span className="header-list-name">
                <FaRegEnvelope className="header-list-icon" />
                <span className="bg-danger-dots dots" data-testid="messages-dots"></span>
              </span>
              &nbsp;
            </li>
            <li className="header-nav-item">
              <span className="header-list-name profile-image">
                <Avatar name="Ibrahim" bgColor="red" textColor="#ffffff" size={40} avatarSrc="" />
              </span>
              <span className="header-list-name profile-name">
                Ibrahim
                <FaCaretDown className="header-list-icon caret" />
              </span>
              <ul className="dropdown-ul">
                <li className="dropdown-li"></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};
export default Header;
