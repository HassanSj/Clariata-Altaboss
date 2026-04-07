import React, {ReactElement} from 'react';
import {useRouter} from 'next/router';
import CardCentered from '~/ui/components/Containers/CardCentered';
import CardCenteredHeader from '~/ui/components/Containers/CardCenteredHeader';
import api from '~/services/api';
import {AxiosResponse} from "axios";
import Typography from "@material-ui/core/Typography";
import paths from "~/ui/constants/paths";
import {get} from "lodash";

const { LOGIN } = paths;

const Verify = (): ReactElement => {
  const router = useRouter();
  let code = get(router.query,'verificationCode');

  const verifyToken = async () => {
    if (!code) {
      return;
    }
    try {
      const res: AxiosResponse = await api.user.verify(code);
      router.replace(LOGIN);
    } catch (err) {
      code = null;
    }
  };
  verifyToken();

  return (
    <CardCentered>
      <CardCenteredHeader>Verification</CardCenteredHeader>
      <Typography variant="subtitle1" gutterBottom>
        { code ? 'Verifying your account. Please wait...' : 'Invalid token. Please resend verification and try again' }
      </Typography>
    </CardCentered>
  );
};

export default Verify;
