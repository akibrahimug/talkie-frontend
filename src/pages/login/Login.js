import { React, useState, useEffect } from 'react';
import '@pages/login/Login.scss';
import { FaArrowRight } from 'react-icons/fa';
import Input from '@components/input/Input';
import Button from '@components/button/Button';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '@services/api/auth/auth.service';
import useLocalStorage from '@hooks/useLocalStorage';
import { Utils } from '@services/utils/utils.service';
import useSessionStorage from '@hooks/useSessionStorage';
import { useDispatch } from 'react-redux';
const Login = () => {
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [keepLoggedIn, setkeepLoggedIn] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [alertType, setAlertType] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState();

  const [setStoredUsername] = useLocalStorage('username', 'set');
  const [setLoggedIn] = useLocalStorage('keepLoggedIn', 'set');
  const [pageReload] = useSessionStorage('payload', 'set');

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const loginUser = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const result = await authService.signin({
        username,
        password
      });
      setLoggedIn(true);
      setStoredUsername(username);
      setHasError(false);
      setAlertType('alert-success');
      Utils.dispatchUser(result, pageReload, dispatch, setUser);
    } catch (error) {
      setLoading(false);
      setHasError(true);
      setAlertType('alert-error');
      setErrorMessage(error?.response?.data.message);
    }
  };

  useEffect(() => {
    if (loading && !user) return;
    if (user) navigate('/app/social/streams');
  }, [loading, user, navigate]);

  return (
    <div className="auth-inner">
      {hasError && errorMessage ? (
        <div className={`alerts ${alertType}`} role="alert">
          {errorMessage}
        </div>
      ) : (
        <></>
      )}
      <form className="auth-form" onSubmit={loginUser}>
        <div className="form-input-container">
          <Input
            id="username"
            name="username"
            type="text"
            value={username}
            placeholder="Enter Username"
            labelText="Username"
            style={{ border: `${hasError ? '1px solid #fa9b8a' : ''}` }}
            handleChange={(e) => setUserName(e.target.value)}
          />
          <Input
            id="password"
            name="password"
            type="text"
            value={password}
            placeholder="Enter password"
            labelText="Password"
            style={{ border: `${hasError ? '1px solid #fa9b8a' : ''}` }}
            handleChange={(e) => setPassword(e.target.value)}
          />
          <label className="checkmark-container" htmlFor="checkbox">
            <input
              id="checkbox"
              type="checkbox"
              name="checkbox"
              value={keepLoggedIn}
              handleChange={() => setkeepLoggedIn(!keepLoggedIn)}
            />
            Keep me signed in
          </label>
        </div>
        {/* button component */}
        <Button
          label={`${loading ? 'Please wait ...' : 'LOGIN'}`}
          className="auth-button button"
          disabled={!username || !password ? true : false}
        />

        <Link to={'/forgot-password'}>
          <span className="forgot-password">
            Forgot password? <FaArrowRight className="arrow-right" />
          </span>
        </Link>
      </form>
    </div>
  );
};

export default Login;
