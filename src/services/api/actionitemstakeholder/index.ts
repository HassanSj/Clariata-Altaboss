import {AxiosPromise} from 'axios';
import request from '../request';
import {ActionItemStakeholder} from "~/types/api/actionItemStakeholder";
import {Person} from "~/types/api/person";
import api from "~/services/api";

/**
 * Get an ActionItemStakeholder by it's ID.
 * @param id
 */
export const get = (householdId: string | number,
                    objectiveId: string | number,
                    actionItemId: string | number,
                    id: string | number): AxiosPromise<ActionItemStakeholder> =>
  request.private({
    method: 'get',
    url: `household/${householdId}/objective/${objectiveId}/actionItem/${actionItemId}/actionitemstakeholder/${id}`,
  });

/**
 * Create a new ActionItemStakeholder.
 * @param data
 */
export const create = (householdId: string | number,
                       objectiveId: string | number,
                       actionItemId: string | number,
                       data: any): AxiosPromise<ActionItemStakeholder> =>
  request.private({
    method: 'post',
    url: `household/${householdId}/objective/${objectiveId}/actionItem/${actionItemId}/actionitemstakeholder`,
    data
  });

/**
 * Update an existing ActionItemStakeholder.
 * @param id
 * @param data
 */
export const update = (householdId: string | number,
                       objectiveId: string | number,
                       actionItemId: string | number,
                       id: string | number,
                       data: ActionItemStakeholder): AxiosPromise<ActionItemStakeholder> =>
  request.private({
    method: 'put',
    url: `household/${householdId}/objective/${objectiveId}/actionItem/${actionItemId}/actionitemstakeholder/${id}`,
    data
  });

/**
 * Remove an existing ActionItemStakeholder.
 * @param id
 */
export const remove = (householdId: string | number,
                       objectiveId: string | number,
                       actionItemId: string | number,
                       id: string | number,
                       data: ActionItemStakeholder): AxiosPromise<unknown> =>
  request.private({
    method: 'delete',
    url: `household/${householdId}/objective/${objectiveId}/actionItem/${actionItemId}/actionitemstakeholder/${id}`,
    data
  });

/**
 * List ActionItemStakeholder's.
 */
export const list = (householdId: string | number,
                     objectiveId: string | number,
                     actionItemId: string | number): AxiosPromise<ActionItemStakeholder[]> =>
  request.private({
    method: 'get',
    url: `household/${householdId}/objective/${objectiveId}/actionItem/${actionItemId}/actionitemstakeholder/list`,
  });

/**
 * List ActionItemStakeholder's w/ all relations populated.
 */
export const listFull = async (householdId: number,
                     objectiveId: string | number,
                     actionItemId: string | number): Promise<ActionItemStakeholder[]> => {
  const result: ActionItemStakeholder[] = [];
  const res = await list(householdId, objectiveId, actionItemId);

  if (res?.data) {
    const promises: any = [];
    res?.data.forEach((s: ActionItemStakeholder) => {
      promises.push(api.person.getFull(s.PersonID, householdId).then((p: Person) => result.push({...s, Person: p})))
    });
    await Promise.all(promises);
  }

  return result;
}