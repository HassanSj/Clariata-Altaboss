import { AxiosPromise } from 'axios';
import request from '../request';
import { Firm } from '~/types/api/firm';
import { User } from '~/types/api/user';

/**
 * Get all firms.
 */
 export const getFirms = (): AxiosPromise<unknown> =>
 request.private({
   method: 'get',
   url: `firms`,
 });

 /**
 * Create a new firm.
 */
  export const createFirm = (data: Firm): AxiosPromise<unknown> =>
  request.private({
    method: 'post',
    url: `firm`,
    data
  });

  /**
 * Update a new firm.
 */
   export const updateFirm = (data: Firm): AxiosPromise<unknown> =>
   request.private({
     method: 'put',
     url: `firm?firmId=${data.FirmID}`,
     data
   });


   /**
 * Delete a Firm.
 */
    export const deleteFirm = (id: number): AxiosPromise<unknown> =>
    request.private({
      method: 'delete',
      url: `firm?firmId=${id}`
    });

    /**
 * Get firms users.
 */
 export const getFirmUsers = (firmId: number): AxiosPromise<User[]> =>
 request.private({
   method: 'get',
   url: `firm/${firmId}/user/list`,
 });

     /**
 * Get firm.
 */
  export const getFirm = (firmId: number): AxiosPromise<Firm> =>
  request.private({
    method: 'get',
    url: `firm?firmId=${firmId}`,
  });