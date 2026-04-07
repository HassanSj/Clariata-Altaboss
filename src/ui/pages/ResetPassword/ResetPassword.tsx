import React, {ReactElement} from 'react';
import {useRouter} from 'next/router';
import Button from '../../components/Button';
import initialValues from './form/initialValues';
import validate from './form/validate';
import styles from './ResetPassword.module.scss';
import CardCentered from "~/ui/components/Containers/CardCentered";
import CardCenteredHeader from "~/ui/components/Containers/CardCenteredHeader";
import CardCenteredFooter from "~/ui/components/Containers/CardCenteredFooter";
import {AxiosResponse} from "axios";
import api from "~/services/api";
import InputField from "~/ui/components/Forms/InputField";
import Input from "~/ui/components/Forms/Input";
import FormWrapper from "~/ui/components/Forms/FormWrapper";
import {extractServerError} from "~/services/api/errors";
import {get} from "lodash";
import paths from "~/ui/constants/paths";
import {IFormActionProps} from "~/types/forms";

const { LOGIN } = paths;

interface IValues {
  Password: string;
}

const ResetPasswordForm = (): ReactElement => {
  const router = useRouter();
  const token = get(router.query,'token');

  const resetPassword = async (values: IValues, {setErrors}: IFormActionProps) => {
    try {
      const res: AxiosResponse = await api.user.resetPasswordWithToken(token, values.Password);
      setErrors({ successMessage: 'Password reset successfully!' });
      router.replace(LOGIN);
    } catch (err) {
      setErrors({ backError: extractServerError(err) });
    }
  };

  return (
    <CardCentered width={4}>
      <CardCenteredHeader>Reset Password</CardCenteredHeader>
      <FormWrapper initialValues={initialValues}
                   validationSchema={validate}
                   onSubmit={resetPassword}
                   successMessage="Password reset successfully!">
        <div className={styles.inner}>
          <InputField type="password"
                      ivariant="filled"
                      name="Password"
                      component={Input}
                      placeholder="Enter New Password"
                      label="Enter New Password" />
        </div>
        <CardCenteredFooter>
          <Button type="submit" text="Reset Password" variant="contained" size="large" color="primary" />
          <Button type="button" text="Back to login" size="large" color="default" path="/login"/>
        </CardCenteredFooter>
      </FormWrapper>
    </CardCentered>
  );
};

export default ResetPasswordForm;
