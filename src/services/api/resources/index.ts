import { AxiosPromise } from 'axios';
import request from '../request';
import { Resource } from '~/types/api/resource';

/**
 * Get all resources.
 */
export const getAllResources = (): AxiosPromise<Resource[]> =>
  request.private({
    method: 'get',
    url: `resources`,
  });

/**
 * Get a single resource.
 */

export const getOneResource = (id: number): AxiosPromise<unknown> =>
  request.private({
    method: 'get',
    url: `resource?resourceId=${id}`,
  });

/**
 * Add a resource.
 */
export const addResource = (data: Resource): AxiosPromise<unknown> => 
  request.private({
    method: 'post',
    url: `resource`,
    data,
  });


/**
 * Update a resource.
 */
export const updateResource = (resourceId: number, data: Resource): AxiosPromise<unknown> =>
  request.private({
    method: 'put',
    url: `resource/${resourceId}`,
    data,
  });

/**
 * Delete a resource.
 */
export const deleteResource = (id: number): AxiosPromise<unknown> =>
  request.private({
    method: 'post',
    url: `DeleteResource?id=${id}`,
  });
