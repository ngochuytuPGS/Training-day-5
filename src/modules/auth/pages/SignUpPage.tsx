import { replace } from 'connected-react-router';
import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'typesafe-actions';
import { API_PATHS } from '../../../configs/api';
import { ROUTES } from '../../../configs/routes';
import logo from '../../../logo-420-x-108.png';
import { ISignUpParams } from '../../../models/auth';
import { AppState } from '../../../redux/reducer';
import { getErrorMessageResponse } from '../../../utils';
import { RESPONSE_STATUS_SUCCESS } from '../../../utils/httpResponseCode';
import { fetchThunk } from '../../common/redux/thunk';
import SignUpForm from '../components/SignUpForm';

const LoginPage = () => {
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const onSignUp = useCallback(
    async (values: ISignUpParams) => {
      setErrorMessage('');
      setLoading(true);

      const json = await dispatch(fetchThunk(API_PATHS.signUp, 'post', values));

      setLoading(false);

      if (json?.code === RESPONSE_STATUS_SUCCESS) {
        setSuccessMessage('Đăng ký thành công, tự động chuyển trang sau 5 giây');
        setTimeout(() => {
          dispatch(replace(ROUTES.login));
        }, 5000);
        return;
      }

      setErrorMessage(getErrorMessageResponse(json));
    },
    [dispatch],
  );

  return (
    <div className="container d-flex justify-content-center align-items-center flex-column">
      <img src={logo} alt='' className="login__logo" />
      <SignUpForm onSignUp={onSignUp} loading={loading} errorMessage={errorMessage} successMessage={successMessage} />
    </div>
  );
};

export default LoginPage;
