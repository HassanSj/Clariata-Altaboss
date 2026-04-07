import { AxiosPromise } from 'axios';
import request from '../request';
import { RegistrationCode } from '~/types/api/registrationcode';

/**
 * Get all registration code.
 */
 export const getRegistrationCodes = (): AxiosPromise<unknown> =>
 request.private({
   method: 'get',
   url: `registrationcodes`,
 });

 /**
 * Create a new registration code.
 */
  export const createRegistrationCode = (data: RegistrationCode): AxiosPromise<unknown> =>
  request.private({
    method: 'post',
    url: `registrationcode`,
    data
  });


   /**
 * Create a new registration code.
 */
    export const deleteRegistrationCode = (id: number): AxiosPromise<unknown> =>
    request.private({
      method: 'post',
      url: `delete?id=${id}`
    });