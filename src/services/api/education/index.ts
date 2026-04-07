import {AxiosPromise} from 'axios';
import request from '../request';
import {buildOwnerUrl, getHttpMethod} from "~/ui/constants/person";
import {OwnerParams} from "~/types/relations";
import {OwnerModelType} from "~/ui/constants/api";
import {EducationItem} from "~/types/api/educationItem";

const MODEL = OwnerModelType.EDUCATION;

/**
 * Get an item by it's ID.
 * @param id
 */
export const get = (id: string | number): AxiosPromise<unknown> =>
  request.private({
    method: 'get',
    url: `${MODEL}/${id}`,
  });

/**
 * Create if no modelId is found. Otherwise, update.
 * @param data
 */
export const createOrUpdate = (ownerParams: OwnerParams,
                               data: EducationItem): AxiosPromise<unknown> => {
  return request.private({
    method: getHttpMethod(ownerParams),
    url: buildOwnerUrl(ownerParams),
    data
  });
}

/**
 * Create new.
 * @param data
 */
export const create = (ownerParams: OwnerParams,
                       data: EducationItem): AxiosPromise<unknown> => {
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
export const update = (ownerParams: OwnerParams, data: EducationItem): AxiosPromise<unknown> =>
  request.private({
    method: 'put',
    url: buildOwnerUrl(ownerParams),
    data
  });

/**
 * Remove an existing.
 * @param ownerParams
 * @param data
 */
export const remove = (ownerParams: OwnerParams, data: EducationItem): AxiosPromise<unknown> =>
  request.private({
    method: 'delete',
    url: buildOwnerUrl(ownerParams),
    data
  });

/**
 * List all.
 */
export const list = (ownerParams: OwnerParams): AxiosPromise<EducationItem[]> =>
  request.private({
    method: 'get',
    url: buildOwnerUrl(ownerParams)
  });
