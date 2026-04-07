import {AxiosPromise} from 'axios';
import request from '../request';
import {Organization} from "~/types/api/organization";

/**
 * Get one by it's ID.
 * @param id
 */
export const get = (id: string | number): AxiosPromise<unknown> =>
  request.private({
    method: 'get',
    url: `organization/${id}`,
  });

/**
 * Create a new.
 * @param data
 */
export const create = (data: Organization): AxiosPromise<unknown> =>
  request.private({
    method: 'post',
    url: `organization`,
    data
  });

/**
 * Update an existing.
 * @param id
 * @param data
 */
export const update = (id: string | number,
                       data: Organization): AxiosPromise<unknown> =>
  request.private({
    method: 'put',
    url: `organization/${id}`,
    data
  });

/**
 * Remove an existing.
 * @param id
 */
export const remove = (id: string | number): AxiosPromise<unknown> =>
  request.private({
    method: 'delete',
    url: `organization/${id}`,
  });

/**
 * List all.
 */
export const list = (): AxiosPromise<unknown> =>
  request.private({
    method: 'get',
    url: `organization/list`,
  });