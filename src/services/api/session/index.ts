import {AxiosPromise} from 'axios';
import request from '~/services/api/request';

/**
 * Get the current session.
 */
export const get = (SessionGUID: string | null): AxiosPromise<unknown> =>
  request.private({
    method: 'get',
    url: `session?sessionGuid=${SessionGUID}`,
  });

/**
 * Update the current session.
 */
export const update = (data: any): AxiosPromise<unknown> =>
  request.private({
    method: 'get',
    url: `session`,
    data
  });

/**
 * Delete the current session.
 */
export const remove = (): AxiosPromise<unknown> =>
  request.private({
    method: 'delete',
    url: `session`,
  });

/**
 * Get a session value.
 * @param keyname
 */
export const getSessionValue = (keyname: string): AxiosPromise<unknown> =>
  request.private({
    method: 'get',
    url: `sessionvalue/${keyname}`,
  });

/**
 * Set a session value.
 * @param keyname
 * @param value
 */
export const setSessionValue = (keyname: string, value: any): AxiosPromise<unknown> =>
  request.private({
    method: 'put',
    url: `sessionvalue/${keyname}`,
    value,
  });
