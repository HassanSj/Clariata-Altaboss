import {AxiosPromise} from 'axios';
import request from '../request';
import {ObjectiveStakeholder} from "~/types/api/objectiveStakeholder";
import api from "~/services/api";

/**
 * Get an ObjectiveStakeholder by it's ID.
 * @param id
 */
export const get = (householdId: string | number,
                    objectiveId: string | number,
                    id: string | number): AxiosPromise<ObjectiveStakeholder> =>
  request.private({
    method: 'get',
    url: `household/${householdId}/objective/${objectiveId}/objectivestakeholder/${id}`,
  });

/**
 * Create a new ObjectiveStakeholder.
 * @param data
 */
export const create = (householdId: string | number,
                       objectiveId: string | number,
                       data: ObjectiveStakeholder): AxiosPromise<ObjectiveStakeholder> =>
  request.private({
    method: 'post',
    url: `household/${householdId}/objective/${objectiveId}/objectivestakeholder`,
    data
  });

/**
 * Update an existing ObjectiveStakeholder.
 * @param id
 * @param data
 */
export const update = (householdId: string | number,
                       objectiveId: string | number,
                       id: string | number,
                       data: ObjectiveStakeholder): AxiosPromise<ObjectiveStakeholder> =>
  request.private({
    method: 'put',
    url: `household/${householdId}/objective/${objectiveId}/objectivestakeholder/${id}`,
    data
  });

/**
 * Remove an existing ObjectiveStakeholder.
 * @param id
 */
export const remove = (householdId: string | number,
                       objectiveId: string | number,
                       id: string | number,
                       data: ObjectiveStakeholder): AxiosPromise<unknown> =>
  request.private({
    method: 'delete',
    url: `household/${householdId}/objective/${objectiveId}/objectivestakeholder/${id}`,
    data
  });

/**
 * List ObjectiveStakeholder's.
 */
export const list = (householdId: string | number,
                     interviewId: string | number,
                     objectiveId: string | number,): AxiosPromise<ObjectiveStakeholder[]> =>
  request.private({
    method: 'get',
    url: `household/${householdId}/objective/${objectiveId}/objectivestakeholder/list`,
  });

/**
 * List fully populated.
 * @param householdId
 * @param objectiveId
 * @param id
 */
export const listFull = async (householdId: number,
                               interviewId: string | number,
                               objectiveId: string | number): Promise<ObjectiveStakeholder[]> => {
  const result: ObjectiveStakeholder[] = [];
  const promises: any[] = [];
  const res = await list(householdId, interviewId, objectiveId);
  if (res?.data) {
    res?.data?.forEach((a: ObjectiveStakeholder) => {
      promises.push(getFull(householdId, objectiveId, a.ObjectiveStakeholderID)
        .then((as: ObjectiveStakeholder) => result.push(as)));
    });
    await Promise.all(promises);
  }

  return result;
}


/**
 * Get an actionItem by it's ID.
 * @param id
 */
export const getFull = async (householdId: number,
                              objectiveId: string | number,
                              id: string | number): Promise<ObjectiveStakeholder> => {
  const res = await get(householdId, objectiveId, id);
  if (res?.data) {
    if (res?.data?.PersonID) {
      const lres = await api.person.getFull(res.data.PersonID, householdId);
      res.data.Person = lres;
    }
  }

  return res?.data;
}
