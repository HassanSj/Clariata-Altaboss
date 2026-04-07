import {AxiosPromise} from 'axios';
import request from '../request';
import {buildOwnerUrl, getHttpMethod} from "~/ui/constants/person";
import {OwnerParams} from "~/types/relations";
import {OwnerModelType} from "~/ui/constants/api";
import {PersonalRelationship} from "~/types/api/personalRelationship";


const MODEL = OwnerModelType.ADDRESS;

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
 * @param ownerParams
 * @param data
 */
export const createOrUpdate = (ownerParams: OwnerParams,
                               data: PersonalRelationship): AxiosPromise<unknown> => {
  return request.private({
    method: getHttpMethod(ownerParams),
    url: buildOwnerUrl(ownerParams),
    data
  });
}

/**
 * Create new.
 * @param ownerParams
 * @param data
 */
export const create = (ownerParams: OwnerParams,
                       data: PersonalRelationship): AxiosPromise<unknown> => {
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
export const update = (ownerParams: OwnerParams, data: PersonalRelationship): AxiosPromise<unknown> =>
  request.private({
    method: 'put',
    url: buildOwnerUrl(ownerParams),
    data
  });

/**
 * Remove an existing.
 * @param id
 */
export const remove = (ownerParams: OwnerParams, data: PersonalRelationship): AxiosPromise<unknown> =>
  request.private({
    method: 'delete',
    url: buildOwnerUrl(ownerParams),
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

/**
 * List all.
 */
export const listByType = (householdId: string | number, personId: string | number, typeId: string | number): AxiosPromise<unknown> =>
  request.private({
    method: 'get',
    url: `household/${householdId}/person/${personId}/personalrelationship/list?personalRelationshipType=${typeId}`
  });
