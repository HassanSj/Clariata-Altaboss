import {AxiosPromise} from 'axios';
import request from '../request';
import {ActionItem} from "~/types/api/actionItem";
import api from "~/services/api";
import {ActionItemStakeholder} from "~/types/api/actionItemStakeholder";
import {processServerError} from "~/services/api/errors";

/**
 * Get an actionItem by it's ID.
 * @param householdId
 * @param objectiveId
 * @param id
 */
export const get = (householdId: string | number,
                    objectiveId: string | number,
                    id: string | number): AxiosPromise<ActionItem> =>
  request.private({
    method: 'get',
    url: `household/${householdId}/objective/${objectiveId}/actionitem/${id}`,
  });

/**
 * Create a new actionItem.
 * @param householdId
 * @param objectiveId
 * @param data
 */
export const create = (householdId: string | number,
                       objectiveId: string | number,
                       data: any): AxiosPromise<ActionItem> =>
  request.private({
    method: 'post',
    url: `household/${householdId}/objective/${objectiveId}/actionitem/${data?.ParentActionItemID ? data?.ParentActionItemID : 0}`,
    data
  });

/**
 * Update an existing actionItem.
 * @param householdId
 * @param objectiveId
 * @param id
 * @param data
 */
export const update = (householdId: string | number,
                       objectiveId: string | number,
                       id: string | number,
                       data: ActionItem): AxiosPromise<ActionItem> =>
  request.private({
    method: 'put',
    url: `household/${householdId}/objective/${objectiveId}/actionitem/${id}`,
    data
  });

/**
 * Remove an existing actionItem.
 * @param householdId
 * @param objectiveId
 * @param id
 * @param data
 */
export const remove = (householdId: string | number,
                       objectiveId: string | number,
                       id: string | number,
                       data: ActionItem): AxiosPromise<unknown> =>
  request.private({
    method: 'delete',
    url: `household/${householdId}/objective/${objectiveId}/actionitem/${id}`,
    data
  });

/**
 * List actionItem's.
 */
export const list = (householdId: string | number,
                     objectiveId: string | number,
                     id: string | number): AxiosPromise<ActionItem[]> =>
  request.private({
    method: 'get',
    url: `household/${householdId}/objective/${objectiveId}/actionitem/${id}/tree`,
  });

/**
 * List fully populated.
 * @param householdId
 * @param objectiveId
 * @param dreamInterviewId
 */
export const listFull = async (householdId: number,
                     objectiveId: string | number,
                     dreamInterviewId: string | number): Promise<ActionItem[]> => {
  const result: ActionItem[] = [];
  const promises: any[] = [];
  const res = await list(householdId, objectiveId, 0);

  if (res.data) {
    res?.data?.forEach((a: ActionItem) => {
      try {
        promises.push(getFull(householdId, objectiveId, dreamInterviewId, a.ActionItemID!).then((as: ActionItem) => result.push(as)));
      } catch (e) {
        processServerError(e, 'actionItem.getFull');
      }
    });
    await Promise.all(promises);
  }

  return result;
}

/**
 * Get an actionItem by it's ID.
 * @param householdId
 * @param objectiveId
 * @param dreamInterviewId
 * @param id
 */
export const getFull = async (householdId: number,
                    objectiveId: string | number,
                    dreamInterviewId: string | number,
                    id: string | number): Promise<ActionItem> => {
  const res = await get(householdId, objectiveId, id);
  if (res.data) {

    // Objective
    if (res.data.ObjectiveID && dreamInterviewId) {
      // TODO - double check whether we need to populate this
      // const ores = await api.objective.get(householdId, dreamInterviewId, res.data.ObjectiveID);
      // res.data.Objective = ores?.data;
    }

    // Lead
    if (res.data.LeadPerson) {
      // TODO - double check whether we need to populate this
      // const lres = await api.person.getFull(res.data.LeadPerson, householdId);
      // res.data.Person = lres;
    }

    // Stakeholders
    try {
      const sres: ActionItemStakeholder[] = await api.actionitemstakeholder.listFull(householdId, objectiveId, id);
      if (sres) {
        res.data.Stakeholders = sres;
      }
    } catch (e) {
      processServerError(e, 'actionItem.getFull');
    }

    // Comments
    try {
      if (res.data.CommentSetID) {
        const cres = await api.comment.listForHousehold(householdId, res.data.CommentSetID);
        if (cres?.data) {
          res.data.Comments = cres?.data;
        }
      }
    } catch (e) {
      processServerError(e, 'actionItem.getFull');
    }

    // Children
    if (res.data.ActionItemList) {
      const promises: any[] = [];
      res?.data?.ActionItemList?.forEach((a: ActionItem) => {
        try {
          promises.push(getFull(householdId, objectiveId, id, a.ActionItemID!).then((as: ActionItem) => a = as));
        } catch (e) {
          processServerError(e, 'actionItem.getFull');
        }
      });
      await Promise.all(promises);
    }

  }

  return res?.data;
}
