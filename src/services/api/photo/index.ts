import {AxiosPromise} from 'axios';
import request from '../request';
import {buildOwnerUrl, getHttpMethod} from "~/ui/constants/person";
import {OwnerParams} from "~/types/relations";
import {OwnerModelType} from "~/ui/constants/api";
import {Photo} from "~/types/api/photo";

const MODEL = OwnerModelType.PHOTO;

/**
 * Get an item by it's ID.
 * @param id
 */
export const get = (ownerParams: OwnerParams): AxiosPromise<unknown> =>
  request.private({
    method: 'get',
    url: buildOwnerUrl(ownerParams),
  });

/**
 * Get an item by it's ID.
 * @param id
 */
export const getById = (id: string | number): AxiosPromise<unknown> =>
  request.private({
    method: 'get',
    url: `${MODEL}/${id}`,
  });



/**
 * Create if no modelId is found. Otherwise, update.
 * @param ownerParams
 * @param data
 * @param query
 */
export const createOrUpdate = (ownerParams: OwnerParams, data: Photo, query?:string): AxiosPromise<unknown> => {
  return request.private({
    method: getHttpMethod(ownerParams),
    url: `${buildOwnerUrl(ownerParams)}${query ? `?${query}` : ''}`,
    data
  });
}

/**
 * Create new.
 * @param data
 */
export const create = (ownerParams: OwnerParams,
                       data: Photo): AxiosPromise<unknown> => {
  return request.private({
    method: 'post',
    url: buildOwnerUrl(ownerParams),
    data
  });
}

/**
 * Update an existing.
 * @param id
 * @param data
 */
export const update = (ownerParams: OwnerParams, data: Photo): AxiosPromise<unknown> =>
  request.private({
    method: 'put',
    url: buildOwnerUrl(ownerParams),
    data
  });

/**
 * Remove an existing.
 * @param ownerParams
 * @param data
 * @param query
 */
export const remove = (ownerParams: OwnerParams, data: Photo,query?:string): AxiosPromise<unknown> =>
  request.private({
    method: 'delete',
    url: `${buildOwnerUrl(ownerParams)}${query ? `?${query}` : ''}`,
    data
  });

/**
 * List all.
 */
export const list = (ownerParams: OwnerParams): AxiosPromise<unknown> =>
  request.private({
    method: 'get',
    url: buildOwnerUrl(ownerParams)
  });
