import { React, useState, useEffect } from 'react';
import '@pages/auth/auth-tabs/AuthTabs.scss';
import Login from '@pages/auth/login/Login';
import Register from '@pages/auth/register/Register';
import useLocalStorage from '@hooks/useLocalStorage';
import { Utils } from '@services/utils/utils.service';
import { useNavigate } from 'react-router-dom';

const AuthTabs = () => {
  const [type, setType] = useState('Sign In');
  const keepLoggedIn = useLocalStorage('keepLoggedIn', 'get');
  const [env, setEnv] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const enviroment = Utils.appEnviroment();
    setEnv(enviroment);
    if (keepLoggedIn) {
      navigate('/app/social/streams');
    }
  }, [keepLoggedIn, navigate]);

  return (
    <>
      <div className="container-wrapper">
        <div className="environment">DEV</div>
        <div className="container-wrapper-auth">
          <div className="tabs">
            <div className="tabs-auth">
              <ul className="tab-group">
                <li className={`tab ${type === 'Sign In' ? 'active' : ''}`} onClick={() => setType('Sign In')}>
                  <button className="login">Sign In</button>
                </li>
                <li className={`tab ${type === 'Sign Up' ? 'active' : ''}`} onClick={() => setType('Sign Up')}>
                  <button className="signup">Sign Up</button>
                </li>
              </ul>
              {type === 'Sign In' && (
                <div className="tab-item">
                  <Login />
                </div>
              )}
              {type === 'Sign Up' && (
                <div className="tab-item">
                  <Register />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthTabs;
