import Cookies from 'js-cookie';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'typesafe-actions';
import { AppState } from '../../../redux/reducer';
import { ACCESS_TOKEN_KEY } from '../../../utils/constants';
import { removeUserInfo } from '../../auth/redux/authReducer';

interface Props {}

const HomePage = (props: Props) => {
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();
  const { user } = useSelector((state: AppState) => ({
    user: state.profile.user,
  }));

  const onLogout = (): void => {
    Cookies.remove(ACCESS_TOKEN_KEY);
    dispatch(removeUserInfo());
  };

  return (
    <div className="container vh-100 d-flex flex-column justify-content-center align-items-center">
      <div className="mb-2"> HomePage - Hello {user?.name}</div>
      <button type="button" className="btn btn-secondary" onClick={onLogout}>
        Đăng xuất
      </button>
    </div>
  );
};

export default HomePage;
