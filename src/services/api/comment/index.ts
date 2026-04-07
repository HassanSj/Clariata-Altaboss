import {AxiosPromise} from 'axios';
import request from '../request';
import {buildOwnerUrl, getHttpMethod} from "~/ui/constants/person";
import {OwnerParams} from "~/types/relations";
import {OwnerModelType} from "~/ui/constants/api";
import {Comment as CommentItem} from "~/types/api/comment";

const MODEL = OwnerModelType.COMMENT;

/**
 * Get an item by it's ID.
 * @param id
 */
export const get = (id: string | number): AxiosPromise<CommentItem> =>
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
                               data: CommentItem): AxiosPromise<CommentItem> => {
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
                       data: CommentItem): AxiosPromise<CommentItem> => {
  return request.private({
    method: 'post',
    url: buildOwnerUrl(ownerParams),
    data
  });
}

/**
 * Create for a household.
 */
export const createForPerson = (householdId: number, personId: number, commentSetId: number, data: any): AxiosPromise<CommentItem[]> =>
  request.private({
    method: 'post',
    url: `household/${householdId}/person/${personId}/commentset/${commentSetId}/comment`,
    data
  });

/**
 * Create for a household.
 */
export const createForHousehold = (householdId: number, commentSetId: number, data: any): AxiosPromise<CommentItem[]> =>
  request.private({
    method: 'post',
    url: `household/${householdId}/commentset/${commentSetId}/comment`,
    data
  });

/**
 * Create for a user.
 */
export const createForUser = (user: number, commentSetId: number, data: any): AxiosPromise<CommentItem[]> =>
  request.private({
    method: 'post',
    url: `user/${user}/commentset/${commentSetId}/comment`,
    data
  });

/**
 * Update an existing.
 * @param ownerParams
 * @param data
 */
export const update = (ownerParams: OwnerParams, data: CommentItem): AxiosPromise<CommentItem> =>
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
export const remove = (ownerParams: OwnerParams, data: CommentItem): AxiosPromise<unknown> =>
  request.private({
    method: 'delete',
    url: buildOwnerUrl(ownerParams),
    data
  });

/**
 * Remove for a household.
 */
export const removeForPerson = (householdId: number, personId: number, commentSetId: number, commentId: number, data: any): AxiosPromise<CommentItem[]> =>
  request.private({
    method: 'delete',
    url: `household/${householdId}/person/${personId}/commentset/${commentSetId}/comment/${commentId}`,
    data
  });

/**
 * Remove for a household.
 */
export const removeForHousehold = (householdId: number, commentSetId: number, commentId: number, data: any): AxiosPromise<CommentItem[]> =>
  request.private({
    method: 'delete',
    url: `household/${householdId}/commentset/${commentSetId}/comment/${commentId}`,
    data
  });

/**
 * Remove for a user.
 */
export const removeForUser = (user: number, commentSetId: number, commentId: number, data: any): AxiosPromise<CommentItem[]> =>
  request.private({
    method: 'delete',
    url: `user/${user}/commentset/${commentSetId}/comment/${commentId}`,
    data
  });

/**
 * List all.
 */
export const list = (ownerParams: OwnerParams): AxiosPromise<CommentItem[]> =>
  request.private({
    method: 'get',
    url: buildOwnerUrl(ownerParams)
  });

/**
 * List all for a household.
 */
export const listForPerson = (householdId: number, personId: number, commentSetId: number): AxiosPromise<CommentItem[]> =>
  request.private({
    method: 'get',
    url: `household/${householdId}/person/${personId}/commentset/${commentSetId}/comment/tree`
  });

/**
 * List all for a household.
 */
export const listForHousehold = (householdId: number, commentSetId: number): AxiosPromise<CommentItem[]> =>
  request.private({
    method: 'get',
    url: `household/${householdId}/commentset/${commentSetId}/comment/tree`
  });

/**
 * List all for a user.
 */
export const listForUser = (user: number, commentSetId: number): AxiosPromise<CommentItem[]> =>
  request.private({
    method: 'get',
    url: `user/${user}/commentset/${commentSetId}/comment/tree`
  });


