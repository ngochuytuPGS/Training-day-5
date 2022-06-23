import { Form, Formik } from 'formik';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { ILoginParams, ILoginValidation } from '../../../models/auth';
import { validateLogin } from '../utils';
import FormikField from './FormikField';

interface Props {
  onLogin(values: ILoginParams): void;
  loading: boolean;
  errorMessage: string;
}

const LoginForm = ({ onLogin, loading, errorMessage }: Props) => {
  const formValues: ILoginParams = { email: '', password: '', rememberMe: false };

  const validate = React.useCallback((values: ILoginParams): {} | ILoginValidation => {
    const validation = validateLogin(values);

    if (validation.email === '' && validation.password === '') {
      return {};
    } else {
      return validation;
    }
  }, []);

  return (
    <Formik initialValues={formValues} onSubmit={(values) => onLogin(values)} validate={(values) => validate(values)}>
      <Form className="row g-3 needs-validation login__form">
        {errorMessage && (
          <div className="alert alert-danger" role="alert">
            {errorMessage}
          </div>
        )}

        <FormikField
          display="column"
          labelPosition="before"
          asHTMLElement="input"
          inputType="text"
          fieldName="email"
          fieldClassName="form-control"
          showFormikValidation={true}
        />
        <FormikField
          display="column"
          labelPosition="before"
          asHTMLElement="input"
          inputType="password"
          fieldName="password"
          fieldClassName="form-control"
          showFormikValidation={true}
        />
        <FormikField
          display="row"
          labelPosition="after"
          asHTMLElement="input"
          inputType="checkbox"
          fieldName="rememberMe"
          fieldClassName="form-check-input me-2"
          showFormikValidation={false}
        />

        <div className="row justify-content-md-center my-3 mx-0">
          <div className="col-md-auto">
            <button
              className="btn btn-primary d-flex align-items-center justify-content-center"
              type="submit"
              disabled={loading}
            >
              {loading && <div className="spinner-border spinner-border-sm text-light me-2" role="status" />}
              <FormattedMessage id="login" />
            </button>
          </div>
        </div>
      </Form>
    </Formik>
  );
};

export default LoginForm;
