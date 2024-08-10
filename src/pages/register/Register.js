import { React, useState, useEffect } from 'react';
import '@pages/register/Register.scss';
import Input from '@components/input/Input';
import Button from '@components/button/Button';
import { authService } from '@services/api/auth/auth.service';
import { Utils } from '@services/utils/utils.service';
import { useNavigate } from 'react-router-dom';
import useLocalStorage from '@hooks/useLocalStorage';
import useSessionStorage from '@hooks/useSessionStorage';
import { useDispatch } from 'react-redux';
const Register = () => {
  const [username, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [alertType, setAlertType] = useState('');
  const [hasError, setHasError] = useState(false);
  const [user, setUser] = useState();

  const [setStoredUsername] = useLocalStorage('username', 'set');
  const [setLoggedIn] = useLocalStorage('keepLoggedIn', 'set');
  const [pageReload] = useSessionStorage('payload', 'set');

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const registerUser = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const avatarColor = Utils.avatarColor();
      const avatarImage = Utils.generateAvatar(username.charAt(0).toUpperCase(), avatarColor);
      const result = await authService.signup({
        username,
        email,
        password,
        avatarColor,
        avatarImage
      });
      setStoredUsername(username);
      setLoggedIn(true);
      setHasError(false);
      setAlertType('alert-success');
      Utils.dispatchUser(result, pageReload, dispatch, setUser);
    } catch (error) {
      setLoading(false);
      setAlertType('alert-error');
      setHasError(true);
      setErrorMessage(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    if (loading && !user) return;
    if (user) {
      navigate('/app/social/streams');
    }
  }, [loading, user, navigate]);
  return (
    <div className="auth-inner">
      {hasError && errorMessage && (
        <div className={`alerts ${alertType}`} role="alert">
          {errorMessage}
        </div>
      )}

      <form className="auth-form" onSubmit={registerUser}>
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
            id="email"
            name="Email"
            type="text"
            value={email}
            placeholder="Enter email"
            labelText="Email"
            style={{ border: `${hasError ? '1px solid #fa9b8a' : ''}` }}
            handleChange={(e) => setEmail(e.target.value)}
          />
          <Input
            id="password"
            name="password"
            type="password"
            value={password}
            placeholder="Enter password"
            labelText="Password"
            style={{ border: `${hasError ? '1px solid #fa9b8a' : ''}` }}
            handleChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {/* button component */}
        <Button
          label={`${loading ? 'Please wait...' : 'SIGNUP'}`}
          className="auth-button button"
          disabled={!username || !email || !password ? true : false}
        />
      </form>
    </div>
  );
};

export default Register;
