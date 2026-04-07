import {AxiosPromise} from 'axios';
import request from '../request';

/**
 * List all.
 */
export const list = (): AxiosPromise<unknown> =>
  request.private({
    method: 'get',
    url: `actionitemtype/list`,
  });
