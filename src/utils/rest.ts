import {AxiosResponse} from 'axios';
import {ITokens} from '~/services/auth';
import {logSimple} from '~/ui/constants/utils';

export const toTokenFromResponse = (res: AxiosResponse) => {
  logSimple('toTokenFromResponse', res);
  const cookieHeader = res.headers['set-cookie'];
  const cookieParts = cookieHeader.split(';');
  const token: ITokens = {
    token: cookieParts[0].split('=')[1],
    expires_at: cookieParts[1].split('=')[1],
  };
  return token;
};

export const camelToSnakeCase = (str: string) => str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
