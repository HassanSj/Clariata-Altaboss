import {AxiosPromise} from "axios";
import request from "~/services/api/request";
import {Notification} from "~/types/api/notification";

/**
 * Get a by it's ID.
 * @param id
 */
export const get = (id: string | number): AxiosPromise<Notification> =>
  request.private({
    method: 'get',
    url: `notification/${id}`,
  });

/**
 * Create a new.
 * @param data
 */
export const create = (data: Notification): AxiosPromise<Notification> =>
  request.private({
    method: 'post',
    url: `notification`,
    data
  });

/**
 * Update an existing.
 * @param id
 * @param data
 */
export const update = (id: string | number, data: Notification): AxiosPromise<Notification> =>
  request.private({
    method: 'put',
    url: `notification/${id}`,
    data
  });

/**
 * List all.
 */
export const list = (): AxiosPromise<unknown> =>
  request.private({
    method: 'get',
    url: `notification/list`,
  });
