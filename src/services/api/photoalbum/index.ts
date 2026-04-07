import {AxiosPromise} from 'axios';
import request from '../request';
import {PhotoAlbum} from "~/types/api/photoAlbum";


/**
 * Get an item by it's ID.
 * @param id
 */
export const get = (id: string | number): AxiosPromise<unknown> =>
  request.private({
    method: 'get',
    url: `photoalbum/${id}`,
  });

/**
 * Create new.
 * @param data
 */
export const create = (data: PhotoAlbum): AxiosPromise<unknown> =>
  request.private({
    method: 'post',
    url: `photoalbum`,
    data
  });

/**
 * Update an existing.
 * @param id
 * @param data
 */
export const update = (id: string | number, data: PhotoAlbum): AxiosPromise<unknown> =>
  request.private({
    method: 'put',
    url: `photoalbum/${id}`,
    data
  });

/**
 * Remove an existing.
 * @param id
 */
export const remove = (id: string | number): AxiosPromise<unknown> =>
  request.private({
    method: 'delete',
    url: `photoalbum/${id}`,
  });

/**
 * List all.
 */
export const list = (): AxiosPromise<unknown> =>
  request.private({
    method: 'get',
    url: `photoalbum/list`,
  });