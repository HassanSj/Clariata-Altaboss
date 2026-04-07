import React, {ReactElement} from 'react';
import {useRouter} from 'next/router';
import Button from '../../components/Button';
import initialValues from './form/initialValues';
import validate from './form/validate';
import styles from './Login.module.scss';
import CardCenteredFooter from '~/ui/components/Containers/CardCenteredFooter';
import InputField from "~/ui/components/Forms/InputField";
import Input from "~/ui/components/Forms/Input";
import FormWrapper from "~/ui/components/Forms/FormWrapper";
import {IFormActionProps} from "~/types/forms";
import {useStoreActions} from "~/store/hooks";
import logo from '../../../../public/images/logo/logo.png';
import classnames from "classnames";
import {Grid} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import { AxiosResponse } from 'axios';
import api from '~/services/api';
import { setAccessToken, setAuthenticated, setSessionGUID } from '~/services/auth';

interface IValues {
  Username: string;
  Password: string;
}

const LoginForm = (): ReactElement => {
  const router = useRouter();
  const onLogin = useStoreActions(actions => actions.user.onLogin);

  const login = async (values: IValues, {setErrors}: IFormActionProps) => {
    const {Username, Password} = values;

    onLogin({
      values: {Username, Password},
      setErrors,
      router
    });
  };


  return (
    <div className={classnames(styles.container)}>
      <div className={classnames(styles.background)}>
        <div className={classnames(styles.logoWrapper)}>
          <img src={logo} className={classnames(styles.logo)}/>
        </div>
      </div>
      <div className={classnames(styles.content)}>
        <div className={classnames(styles.form)}>
          <FormWrapper initialValues={initialValues}
                       validationSchema={validate}
                       onSubmit={login}
                       successMessage="Login successful!"
                       errorMessage="Username or password is incorrect!">
            <div className={styles.inner}>
              <Typography variant="h5" component="h6" className={styles.form_header}>
                Sign In
              </Typography>
              <InputField type="text"
                          ivariant="filled"
                          name="Username"
                          component={Input}
                          placeholder="Email Address"
                          label="Email Address"/>
              <InputField type="password"
                          ivariant="filled"
                          name="Password"
                          component={Input}
                          placeholder="Password"
                          label="Password"/>
                          {/* 1px solid rgba(0, 0, 0, 0.23); */}
            </div>
            <CardCenteredFooter>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <Button
                    fullWidth
                    type="submit"
                    text="Sign in"
                    variant="contained"
                    size="large"
                    color="secondary"
                  />
                </Grid>
              </Grid>
              <div className={classnames(styles.footerFormFooter)}>
                <Button type="button" text="Forgot password" size="small" color="primary" path="/password" className={classnames(styles.footerFormSecondaryButton)}/>
                {/* <Button type="button" text="Resend verification" size="small" color="primary" path="/verification" className={classnames(styles.footerFormSecondaryButton)}/> */}
                {/* <Button type="button" text="Create account" size="small" color="primary" path="/register" className={classnames(styles.footerFormSecondaryButton)}/> */}
              </div>
            </CardCenteredFooter>
          </FormWrapper>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
