import { React, useState } from 'react';
import '@pages/auth/forgot-password/ForgotPassword.scss';
import { FaArrowLeft } from 'react-icons/fa';
import Input from '@components/input/Input';
import Button from '@components/button/Button';
import { authService } from '@services/api/auth/auth.service';
import { Link } from 'react-router-dom';
const ForgotPassword = () => {
  const [hasError, setHasError] = useState(false);
  const [alertType, setAlertType] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const userForgotPassword = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const result = await authService.forgotPassword(email);
      setMessage(result?.response?.data?.message);
      setAlertType('alert-success');
      setHasError(false);
    } catch (error) {
      setLoading(false);
      setAlertType('alert-error');
      setHasError(true);
      setMessage(error?.response?.data?.message);
    }
  };

  return (
    <div className="container-wrapper">
      <div className="container-wrapper-auth">
        <div className="tabs forgot-password-tabs" style={{ height: `${message ? '300px' : ''}` }}>
          <div className="tabs-auth">
            <ul className="tab-group">
              <li className="tab">
                <div className="login forgot-password">Forgot Password</div>
              </li>
            </ul>
            <div className="tab-item">
              <div className="auth-inner">
                {message && alertType && (
                  <div className={`alerts ${alertType}`} role="alert">
                    {message}
                  </div>
                )}

                <form className="forgot-password-form " onSubmit={userForgotPassword}>
                  <div className="form-input-container">
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={email}
                      placeholder="Enter email"
                      labelText="Email"
                      style={{ border: `${hasError ? '1px solid #fa9b8a' : ''}` }}
                      handleChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  {/* button component */}
                  <Button
                    label={`${loading ? 'Please wait...' : 'FORGOT PASSWORD'}`}
                    className="auth-button button"
                    disabled={!email ? true : false}
                  />
                  <Link to={'/'}>
                    <span className="login">
                      <FaArrowLeft className="arrow-left" /> Back to Login
                    </span>
                  </Link>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
