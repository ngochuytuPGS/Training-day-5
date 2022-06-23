import { ISignUpParams } from './../../models/auth';
import { ILoginParams, ILoginValidation, ISignUpValidation } from '../../models/auth';
import { validEmailRegex } from '../../utils';

const validateEmail = (email: string) => {
  if (!email) {
    return 'emailRequire';
  }

  if (!validEmailRegex.test(email)) {
    return 'emailInvalid';
  }

  return '';
};

const validatePassword = (password: string) => {
  if (!password) {
    return 'passwordRequire';
  }

  if (password.length < 4) {
    return 'minPasswordInvalid';
  }

  return '';
};

const validateRepeatPassword = (password: string, repeatPassword: string): string => {
  if (!repeatPassword) {
    return 'repeatPasswordRequire';
  }

  if (password !== repeatPassword) {
    return 'matchPasswordInvalid';
  }

  return '';
};

export const validateLogin = (values: ILoginParams): ILoginValidation => {
  return {
    email: validateEmail(values.email),
    password: validatePassword(values.password),
  };
};

export const validLogin = (values: ILoginValidation) => {
  return !values.email && !values.password;
};

const validateField = (field: string, value: any) => {
  if (value) return '';
  switch (field) {
    case 'name':
      return 'nameRequire';
    case 'gender':
      return 'genderRequire';
    case 'region':
      return 'regionRequire';
    case 'state':
      return 'stateRequire';
  }

  return '';
};

export const validateSignUp = (values: ISignUpParams): ISignUpValidation => {
  return {
    email: validateEmail(values.email),
    password: validatePassword(values.password),
    repeatPassword: validateRepeatPassword(values.password, values.repeatPassword),
    name: validateField('name', values.name),
    gender: validateField('gender', values.gender),
    region: validateField('region', values.region),
    state: validateField('state', values.state),
  };
};
