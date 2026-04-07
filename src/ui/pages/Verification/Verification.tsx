import React, {ReactElement} from 'react';
import {useRouter} from 'next/router';
import Button from '../../components/Button';
import initialValues from './form/initialValues';
import validate from './form/validate';
import styles from './Verification.module.scss';
import CardCentered from '~/ui/components/Containers/CardCentered';
import CardCenteredHeader from '~/ui/components/Containers/CardCenteredHeader';
import CardCenteredFooter from '~/ui/components/Containers/CardCenteredFooter';
import api from '~/services/api';
import {AxiosResponse} from "axios";
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

const VerificationForm = (): ReactElement => {
  const router = useRouter();

  const resend = async (values: IValues, { setErrors }: IFormActionProps) => {
    const { Username } = values;
    try {
      const res: AxiosResponse = await api.user.resendVerification(Username);
      setErrors({ infoMessage: 'Verification sent. Please check your email.' });
      router.replace(LOGIN);
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
      <CardCenteredHeader>Resend Verification</CardCenteredHeader>
      <FormWrapper initialValues={initialValues} validationSchema={validate} onSubmit={resend}>
        <div className={styles.inner}>
          <InputField type="text" name="Username" component={Input} placeholder="Username" label="Username" ivariant="filled" />
        </div>
        <CardCenteredFooter>
          <Button
            type="submit"
            text="Resend"
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

export default VerificationForm;
