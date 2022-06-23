import React, { HTMLAttributes, HTMLInputTypeAttribute } from 'react';
import { ErrorMessage, Field } from 'formik';
import { FormattedMessage } from 'react-intl';

type DisplayType = 'column' | 'row';

type LabelPositionType = 'before' | 'after';

type Props = {
  [key in keyof HTMLAttributes<HTMLElement>]: any;
} & {
  asHTMLElement: keyof JSX.IntrinsicElements;
  display: DisplayType;
  labelPosition: LabelPositionType;
  fieldClassName?: string;
  fieldName: string;
  showFormikValidation: boolean;
};

interface InputElementProps extends Props {
  asHTMLElement: 'input';
  inputType: HTMLInputTypeAttribute;
}

interface OtherElementProps extends Props {
  asHTMLElement: keyof Omit<JSX.IntrinsicElements, 'input'>;
  children?: React.ReactNode;
}

const FormikField = (props: InputElementProps | OtherElementProps) => {
  const { asHTMLElement, display, labelPosition, fieldClassName, fieldName, showFormikValidation, ...rest } = props;
  const { inputType } = props as InputElementProps;
  const { children } = props as OtherElementProps;

  return (
    <div className="col-md-12">
      <div className={`d-flex ${display === 'column' && 'flex-column'}`}>
        <label htmlFor={fieldName} className={`form-label ${labelPosition === 'after' && 'order-1'}`}>
          <FormattedMessage id={fieldName} />
        </label>

        {asHTMLElement === 'input' ? (
          <Field type={inputType} id={fieldName} name={fieldName} className={fieldClassName} {...rest} />
        ) : (
          <Field as={asHTMLElement} id={fieldName} name={fieldName} className={fieldClassName} {...rest}>
            {children}
          </Field>
        )}
      </div>

      {showFormikValidation && (
        <small className="text-danger">
          <ErrorMessage name={fieldName}>{(errorMessage) => <FormattedMessage id={errorMessage} />}</ErrorMessage>
        </small>
      )}
    </div>
  );
};

export default FormikField;
