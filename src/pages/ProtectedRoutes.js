import React, { useCallback, useState } from 'react';
import useLocalStorage from '@hooks/useLocalStorage';
import useSessionStorage from '@hooks/useSessionStorage';
import { userService } from '@services/user/user.service';
import { useDispatch, useSelector } from 'react-redux';
import { addUser } from '@redux/reducers/user/user.reducer';
import { Utils } from '@services/utils/utils.service';
import { useNavigate } from 'react-router-dom';
import useEffectOnce from '@hooks/useEffectOnce';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
function ProtectedRoutes({ children }) {
  const { profile, token } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [tokenIsValid, setTokenIsValid] = useState(false);
  const keepLoggedIn = useLocalStorage('keepLoggedIn', 'get');
  const pageReload = useSessionStorage('pageReload', 'get');
  const [deleteStorageUsername] = useLocalStorage('username', 'delete');
  const [setLoggedIn] = useLocalStorage('keepLoggedIn', 'set');
  const [deleteSessionPayload] = useSessionStorage('pageReload', 'delete');
  const dispatch = useDispatch();

  const checkUser = useCallback(async () => {
    try {
      const response = await userService.checkCurrentUser();
      // dispatch conversation list
      setUserData(response.data.user);
      setTokenIsValid(true);
      dispatch(addUser({ token: response.data.token, profile: response.data.user }));
    } catch (error) {
      setTokenIsValid(false);
      setTimeout(async () => {
        Utils.clearStore({ dispatch, deleteStorageUsername, deleteSessionPayload, setLoggedIn });
        await userService.logoutUser();
        navigate('/');
      }, 1000);
    }
  }, [dispatch, navigate, deleteStorageUsername, deleteSessionPayload, setLoggedIn]);

  useEffectOnce(() => {
    checkUser();
  });

  if (keepLoggedIn || (!keepLoggedIn && userData) || (profile && token) || pageReload) {
    if (!tokenIsValid) {
      return <></>;
    } else {
      return <>{children}</>;
    }
  } else {
    return <>{<Navigate to="/" />}</>;
  }
}

ProtectedRoutes.propTypes = {
  children: PropTypes.node.isRequired
};

export default ProtectedRoutes;
