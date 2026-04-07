import React, {MutableRefObject, ReactElement} from 'react';
import {Form, Formik} from "formik";
import styles from './FormWrapper.module.scss';
import Loader from "~/ui/components/Loader";
import useNotifications from "~/ui/hooks/useNotifications";
import {logSimple} from "~/ui/constants/utils";
import FormNotification from '../FormNotification';

interface IProps {
  initialValues?: any;
  validationSchema?: any;
  onSubmit?: any;
  onChange?: any;
  onValuesChange?: any;
  setFieldValue?: any;
  children: any;
  className?: any;
  modelName?: string;
  successMessage?: string;
  errorMessage?: string;
}

const FormWrapper = ({initialValues, validationSchema, onSubmit, onChange, onValuesChange, children, className, successMessage, errorMessage, modelName}: IProps): ReactElement => {
  const notifications = useNotifications();

  const handleSubmit = async (values: any, formikBag: any) => {
    try {
      console.log(values.currentPassword +" in Formwrapper");
      console.log(values);

      await onSubmit(values, formikBag);

      if (successMessage) {
        notifications.addSuccessNotification(successMessage);
      } else if (modelName) {
        notifications.addSuccessNotification(`${modelName} saved successfully!`);
      } else {
        notifications.addSuccessNotification(`Saved successfully!`);
      }
    } catch (e) {
      if (errorMessage) {
        notifications.addErrorNotification(errorMessage);
      } else {
          notifications.addErrorNotification(e.message)
        // notifications.addErrorNotification('An error occurred. Please try again.');
      }
    }


  }

  const handleChange = (e: any) => {
    if (onChange) {
      onChange(e);
    }
  }

  const handleValuesChange = (vals: any) => {
    if (onValuesChange) {
      onValuesChange(vals);
    }
  }


  return (
    <Formik initialValues={initialValues}
            validationSchema={validationSchema}
            validateOnBlur={false}
            validateOnChange={false}
            enableReinitialize={true}
            onSubmit={handleSubmit}>
      {props => {
        handleValuesChange(props.values);
        return (
          <>
            {Object.keys(props?.errors).length != 0 ?
              <FormNotification errors={props?.errors}/>
              : null}
            <Form onChange={(e) => {
              handleChange(e);
              handleValuesChange(props.values);
            }} className={className}>
              <fieldset disabled={props?.isSubmitting} className={styles.form_fieldset}>
                {children}
              </fieldset>
            </Form>
            {props?.isSubmitting ? <Loader/> : null}
          </>
        )
      }}
    </Formik>
  )
};

export default FormWrapper;
