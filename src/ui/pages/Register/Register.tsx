import React, {ReactElement, useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import Button from '../../components/Button';
import validate from './form/validate';
import styles from './Register.module.scss';
import CardCentered from "~/ui/components/Containers/CardCentered";
import CardCenteredHeader from "~/ui/components/Containers/CardCenteredHeader";
import CardCenteredFooter from "~/ui/components/Containers/CardCenteredFooter";
import {AxiosResponse} from "axios";
import api from "~/services/api";
import InputField from "~/ui/components/Forms/InputField";
import Input from "~/ui/components/Forms/Input";
import FormWrapper from "~/ui/components/Forms/FormWrapper";
import {extractServerError, isUnauthorized} from "~/services/api/errors";
import {IFormActionProps} from "~/types/forms";
import paths from "~/ui/constants/paths";
import { convertImgToBase64URL } from '~/ui/constants/utils';
import initialValues from './form/initialValues';

const { LOGIN } = paths;

interface IValues {
  FirstName: string;
  LastName: string;
  Username: string;
  Password: string;
  ConfirmPassword: string;
  Agreement: boolean;
  RegistrationCode: string;
}

const RegisterForm = (): ReactElement => {
  const router = useRouter();
  const searchParams = new URLSearchParams(document.location.search)

  const code = searchParams.get('code');
  console.log(code);
  const [invitationCode, setInvitationCode] = useState<string | null>('');
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [emailAddress, setEmailAddress] = useState<string>('');

  const loadInvitation = async (invitationCode : string) => {
    const res: AxiosResponse = await api.invitation.getInvitationByCode(invitationCode);
    console.log(res);
    if(res)
    {
      const invitation = await res.data;
      console.log(invitation);
      setFirstName(invitation.FirstName);
      setLastName(invitation.LastName);
      setEmailAddress(invitation.EmailAddress);

    }
  }

  const register = async (values: IValues, {setErrors}: IFormActionProps) => {
    try {
      if(!values.Agreement)
      {
        setErrors({ backError: 'Please agree to the End User License Agreement and Privacy Policy'});
      }
      else {

        if(values.Password.length < 10)
        {
          setErrors({ backError: 'Passwords must be at least 10 characters'});
        }       
        else
        {
          if(values.Password != values.ConfirmPassword)
          {
            setErrors({ backError: 'Passwords DO NOT Match!'});
          }
          else {
            const registration: IRegisterRequest = {
              FirstName: firstName,
              LastName: lastName,
              Username: emailAddress,
              Password: values.Password,
              RegistrationCode: invitationCode as string
            };

            console.log(registration);
            const res: AxiosResponse = await api.user.create(registration);
            console.log(res);
            setErrors({ successMessage: 'Account successfully created! ' });
            router.push(LOGIN);
          }
        }
      }
    } catch (err) {
      if (isUnauthorized(err)) {
        setErrors({ backError: 'Username or password is incorrect.' });
      } else {
        setErrors({ backError: extractServerError(err) });
      }
    }
  };

  useEffect(() => {
    setInvitationCode(code);
    loadInvitation(code as string);
    
  }, [])


  return (
    <CardCentered>
      <FormWrapper initialValues={initialValues}
                    validationSchema={validate}
                   onSubmit={register}
                   successMessage="Registered successfully! Welcome!">
        <div className={styles.inner}>
          <div style={{fontSize: "18px", marginTop: "10px", marginBottom: "10px"}}>
            Welcome {firstName} {lastName}!
          </div>
          <div>
            Please create a password for your Clariata account. 
          </div>
          <div style={{marginTop: "10px", marginBottom: "20px"}}>
            Email Address: <b>{emailAddress}</b>
          </div>
          <InputField type="password"
                      ivariant="filled"
                      name="Password"
                      component={Input}
                      placeholder="Password"
                      label="Password"
                      hint="Minimum length of 10 characters"/>
          <InputField type="password"
                      ivariant="filled"
                      name="ConfirmPassword"
                      component={Input}
                      placeholder="Confirm Password"
                      label="Confirm Password"/>
          <div style={{display: "flex", textAlign: "left"}}>
            <div>
            <InputField type="checkbox"
                      ivariant="filled"
                      name="Agreement"
                      component={Input}
                      />
            </div>            
            <div style={{paddingTop: "10px"}}>By checking this box, I agree to the <a href='https://static1.squarespace.com/static/5f5a3d130783f132e42881e6/t/62d9646562ff5e423c1f66b6/1658414183067/TRIAL+-+Clariata_++End+User+License+Agreement+-+6.20.22_%2825348908%29_%281%29+%281%29.pdf' target='_blank'>End User License Agreement</a> and the <a href='https://static1.squarespace.com/static/5f5a3d130783f132e42881e6/t/62d964d0c7fcf60bf2129957/1658414290942/Clariata_++Privacy+Policy+-+5112022.pdf' target='_blank'>Privacy Policy</a>.</div>
                      </div>  
        </div>
        <CardCenteredFooter>
          <Button type="submit" text="Create Account" variant="contained" size="large" color="primary" />
          <Button type="button" text="Back to login" size="large" color="default" path="/login"/>
        </CardCenteredFooter>
      </FormWrapper>
    </CardCentered>
  );
};

export default RegisterForm;
