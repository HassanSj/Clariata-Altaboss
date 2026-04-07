import {AxiosPromise} from 'axios';
import request from '../request';

/**
 * List all InvitationTypes.
 */
export const list = (): AxiosPromise<unknown> =>
  request.private({
    method: 'get',
    url: `invitationtype/list`,
  });