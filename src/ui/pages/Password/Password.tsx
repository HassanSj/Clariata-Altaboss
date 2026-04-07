import React, {ReactElement} from 'react';
import {useRouter} from 'next/router';
import Button from '../../components/Button';
import initialValues from './form/initialValues';
import validate from './form/validate';
import styles from './Password.module.scss';
import CardCentered from '~/ui/components/Containers/CardCentered';
import CardCenteredHeader from '~/ui/components/Containers/CardCenteredHeader';
import CardCenteredFooter from '~/ui/components/Containers/CardCenteredFooter';
import {AxiosResponse} from "axios";
import api from "~/services/api";
import InputField from "~/ui/components/Forms/InputField";
import Input from "~/ui/components/Forms/Input";
import FormWrapper from "~/ui/components/Forms/FormWrapper";
import {extractServerError, isUnauthorized} from "~/services/api/errors";
import paths from "~/ui/constants/paths";
import {IFormActionProps} from "~/types/forms";

const { LOGIN } = paths;

interface IValues {
  Username: string;
}

const PasswordForm = (): ReactElement => {
  const router = useRouter();

  const reset = async (values: IValues, { setErrors }: IFormActionProps) => {
    const { Username } = values;
    try {
      const res: AxiosResponse = await api.user.sendPasswordResetEmail(Username);
      setErrors({ successMessage: 'Password reset details sent to your email.' });
    } catch (err) {
      if (isUnauthorized(err)) {
        setErrors({ backError: 'Username or password is incorrect.' });
      } else {
        setErrors({ backError: extractServerError(err) });
      }
    }
  };

  return (
    <CardCentered width={4}>
      <CardCenteredHeader>Send Reset Password Email</CardCenteredHeader>
      <FormWrapper initialValues={initialValues}
                   validationSchema={validate}
                   onSubmit={reset}
                   successMessage="Email sent! Please check your email.">
        <div className={styles.inner}>
          <InputField type="text" name="Username" component={Input} placeholder="Email Address" label="Email Address" ivariant="filled" />
        </div>
        <CardCenteredFooter>
          <Button
            type="submit"
            text="Send Reset Password Email"
            variant="contained"
            size="large"
            color="primary"
          />
          <Button type="button" text="Back to login" size="large" color="default" path="/login"/>
        </CardCenteredFooter>
      </FormWrapper>
    </CardCentered>
  );
};

export default PasswordForm;
