import { Form, Formik, FormikProps } from 'formik';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'typesafe-actions';
import { API_PATHS } from '../../../configs/api';
import { IGenderParams, ILocationParams, ISignUpParams, ISignUpValidation } from '../../../models/auth';
import { AppState } from '../../../redux/reducer';
import { RESPONSE_STATUS_SUCCESS } from '../../../utils/httpResponseCode';
import FormikField from './FormikField';
import { fetchThunk } from '../../common/redux/thunk';
import { validateSignUp } from '../utils';

interface Props {
  onSignUp: (values: ISignUpParams) => void;
  loading: boolean;
  errorMessage: string;
  successMessage: string;
}

type APIRegion = {
  locationType: 'region';
};

type APIState = {
  locationType: 'state';
  pid: number;
};

const SignUpForm = ({ onSignUp, errorMessage, successMessage, loading }: Props) => {
  const dispatch = useDispatch<ThunkDispatch<AppState, null, Action<string>>>();

  const [regions, setRegions] = useState<ILocationParams[]>([]);
  const [states, setStates] = useState<ILocationParams[]>([]);

  const formValues: ISignUpParams = {
    email: '',
    password: '',
    gender: '',
    name: '',
    region: '',
    repeatPassword: '',
    state: '',
  };

  const getLocation = useCallback(
    async (apiInfo: APIRegion | APIState) => {
      const apiPath =
        apiInfo.locationType === 'region' ? API_PATHS.getLocation : `${API_PATHS.getLocation}?pid=${apiInfo.pid}`;

      const json = await dispatch(fetchThunk(apiPath, 'get'));
      if (json.code === RESPONSE_STATUS_SUCCESS) {
        apiInfo.locationType === 'region' ? setRegions(json.data) : setStates(json.data);
      }
    },
    [dispatch],
  );

  const GENDER: IGenderParams[] = useMemo(
    () => [
      {
        label: 'Nam',
        value: 'male',
      },
      {
        label: 'Nữ',
        value: 'female',
      },
    ],
    [],
  );

  useEffect(() => {
    getLocation({ locationType: 'region' });
  }, [getLocation]);

  const renderGender = useCallback((): JSX.Element[] => {
    return [
      <option value='' selected disabled hidden key=''>
        -- select an option --
      </option>,
      ...GENDER.map((gender: IGenderParams) => (
        <option key={gender.value} value={gender.value}>
          {gender.label}
        </option>
      )),
    ];
  }, [GENDER]);

  const renderRegions = useCallback((): JSX.Element[] => {
    return [
      <option value='' selected disabled hidden key=''>
        -- select an option --
      </option>,
      ...regions.map((region: ILocationParams) => (
        <option key={region.id} value={region.id}>
          {region.name}
        </option>
      )),
    ];
  }, [regions]);

  const renderStates = useCallback((): JSX.Element[] => {
    return [
      <option value='' selected disabled key=''>
        -- select an option --
      </option>,
      ...states.map((state: ILocationParams) => (
        <option key={state.id} value={state.id}>
          {state.name}
        </option>
      )),
    ];
  }, [states]);

  const validate = (values: ISignUpParams): ISignUpValidation | {} => {
    const validation = validateSignUp(values);

    if (
      validation.email === '' &&
      validation.gender === '' &&
      validation.name === '' &&
      validation.password === '' &&
      validation.region === '' &&
      validation.repeatPassword === '' &&
      validation.state === ''
    ) {
      return {};
    }
    return validation;
  };

  return (
    <Formik initialValues={formValues} onSubmit={(values) => onSignUp(values)} validate={(values) => validate(values)}>
      {({ handleChange, setFieldValue }: FormikProps<ISignUpParams>) => (
        <Form className="row g-3 needs-validation login__form">
          {errorMessage && (
            <div className="alert alert-danger" role="alert">
              {errorMessage}
            </div>
          )}
          {successMessage && (
            <div className="alert alert-success" role="alert">
              {successMessage}
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
            display="column"
            labelPosition="before"
            asHTMLElement="input"
            inputType="password"
            fieldName="repeatPassword"
            fieldClassName="form-control"
            showFormikValidation={true}
          />
          <FormikField
            display="column"
            labelPosition="before"
            asHTMLElement="input"
            inputType="text"
            fieldName="name"
            fieldClassName="form-control"
            showFormikValidation={true}
          />
          <FormikField
            display="column"
            labelPosition="before"
            asHTMLElement="select"
            fieldName="gender"
            fieldClassName="form-select"
            onChange={handleChange}
            showFormikValidation={true}
          >
            {renderGender()}
          </FormikField>

          <FormikField
            display="column"
            labelPosition="before"
            asHTMLElement="select"
            fieldName="region"
            fieldClassName="form-select"
            onChange={(e: any) => {
              setFieldValue('region', e.target.value);
              getLocation({ locationType: 'state', pid: e.target.value });
            }}
            showFormikValidation={true}
          >
            {renderRegions()}
          </FormikField>
          {!!states.length && (
            <FormikField
              display="column"
              labelPosition="before"
              asHTMLElement="select"
              fieldName="state"
              fieldClassName="form-select"
              showFormikValidation={true}
              onChange={(e: any) => {
                handleChange(e);
                console.log('Change', e.target);
              }}
            >
              {renderStates()}
            </FormikField>
          )}

          <div className="row justify-content-md-center my-3 mx-0">
            <div className="col-md-auto">
              <button
                className="btn btn-primary d-flex align-items-center justify-content-center"
                type="submit"
                disabled={loading}
              >
                {loading && <div className="spinner-border spinner-border-sm text-light me-2" role="status" />}
                <FormattedMessage id="register" />
              </button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default SignUpForm;
