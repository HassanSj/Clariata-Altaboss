import get from 'lodash/get';
import {logSimple, logStringError} from "~/ui/constants/utils";

export interface IError {
  response?: {
    config?: any;
    data: {
      message: string;
    };
    status?: number;
    statusText?: string;
  };
}

export const extractServerError = (error: IError): string => {
  return get(error, 'response.statusText', 'Unknown error');
};

export const processServerError = (error: any, module?: string) => {
  logSimple(module || 'unknown', error);
  const errorMsg: string = extractServerError(error);
  logStringError(error, module);
}

export const isUnauthorized = (error: IError): boolean => {
  return error?.response?.status === 401;
};

export const isBadRequest = (error: IError): boolean => {
  return error?.response?.status === 405;
};

export const isNotFound = (error: IError): boolean => {
  return error?.response?.status === 500;
};
