import {AxiosPromise} from 'axios';
import request from '../request';
import {Objective} from "~/types/api/objective";
import api from "~/services/api";
import {processServerError} from "~/services/api/errors";
import {DimensionOfLife} from "~/types/api/dimensionOfLife";
import {MetricOfSuccess} from "~/types/api/metricOfSuccess";
import { Priority } from '~/types/api/priority';

/**
 * Get an objective by it's ID.
 * @param id
 */
export const get = (householdId: string | number,
                    interviewId: string | number,
                    id: string | number): AxiosPromise<Objective> =>
  request.private({
    method: 'get',
    url: `household/${householdId}/interview/${interviewId}/objective/${id}`,
  });

/**
 * Create a new objective.
 * @param data
 */
export const create = (householdId: string | number,
                       interviewId: string | number,
                       data: any): AxiosPromise<Objective> =>
  request.private({
    method: 'post',
    url: `household/${householdId}/interview/${interviewId}/objective`,
    data
  });

/**
 * Update an existing objective.
 * @param id
 * @param data
 */
export const update = (householdId: string | number,
                       interviewId: string | number,
                       id: string | number,
                       data: any): AxiosPromise<Objective> =>
  request.private({
    method: 'put',
    url: `household/${householdId}/interview/${interviewId}/objective/${id}`,
    data
  });

/**
 * Update an list of objectives.
 * @param id
 * @param data
 */
export const updateList = (householdId: string | number,
                       interviewId: string | number,
                       data: Objective[]): AxiosPromise<Objective> =>
  request.private({
    method: 'put',
    url: `household/${householdId}/interview/${interviewId}/objective/list`,
    data
  });

/**
 * Remove an existing objective.
 * @param id
 */
export const remove = (householdId: string | number,
                       interviewId: string | number,
                       id: string | number,
                       data: Objective): AxiosPromise<unknown> =>
  request.private({
    method: 'delete',
    url: `household/${householdId}/interview/${interviewId}/objective/${id}`,
    data
  });

/**
 * List objective's.
 */
export const list = (householdId: string | number,
                     interviewId: string | number): AxiosPromise<Objective[]> =>
  request.private({
    method: 'get',
    url: `household/${householdId}/interview/${interviewId}/objective/list`,
  });

/**
 * List fully populated.
 * @param householdId
 * @param interviewId
 * @param dimensions
 * @param metrics
 */
export const listFull = async (householdId: number,
                               interviewId: number,
                               dimensions: DimensionOfLife[],
                               metrics: MetricOfSuccess[]): Promise<Objective[]> => {
  const result: Objective[] = [];
  const promises: any[] = [];
  const res = await list(householdId, interviewId);
  if (res.data) {
    res?.data?.forEach((a: Objective) => {
      try {
        promises.push(getFull(householdId, interviewId, a?.ObjectiveID, dimensions, metrics).then((as: Objective) => result.push(as)));
      } catch (e) {
        processServerError(e, 'actionItem.getFull');
      }
    });
    await Promise.all(promises);
  }

  return result;
}


/**
 * Get an objective by it's ID.
 * @param householdId
 * @param interviewId
 * @param id
 * @param dimensions
 * @param metrics
 */
export const getFull = async (householdId: number,
                    interviewId: string | number,
                    id: string | number,
                              dimensions?: DimensionOfLife[],
                              metrics?: MetricOfSuccess[]): Promise<Objective> => {
  const res = await get(householdId, interviewId, id);
  if (res.data) {

    // Person
    if (res.data.Champion) {
      try {
        const pres = await api.person.getFull(res.data.Champion, householdId);
        res.data.ChampionPerson = pres;
      } catch (e) {
        processServerError(e, 'actionItem.getFull');
      }
    }

    // Stakeholders
    try {
      const sres = await api.objectivestakeholder.listFull(householdId, interviewId, id);
      res.data.Stakeholders = sres;
    } catch (e) {
      processServerError(e, 'actionItem.getFull');
    }


    // Action items
    try {
      const ares = await api.actionitem.listFull(householdId, id, 0);
      res.data.ActionItemList = ares;
    } catch (e) {
      processServerError(e, 'actionItem.getFull');
    }

    // Dimension
    if(dimensions)
        res.data.DimensionOfLife =
            dimensions?.find(d => d?.DimensionOfLifeID === res.data.DimensionOfLifeID);

    // Metric
    if(metrics)
        res.data.MetricOfSuccess =
            metrics?.find(d => d?.MetricOfSuccessID === res.data.MetricOfSuccessID);

  }

  return res?.data;
}

/**
 * Mark objective tab as complete.
 * @param householdId
 * @param objectiveId
 * @param tabId
 */
export const complete = (householdId: string | number,
  objectiveId: string | number,
  tabId: string | number): AxiosPromise<Objective> =>
  request.private({
    method: 'put',
    url: `household/${householdId}/objective/${objectiveId}/tab/${tabId}/complete`
  });

/**
 * Mark objective tab as uncomplete.
 * @param householdId
 * @param objectiveId
 * @param tabId
 */
 export const unComplete = (householdId: string | number,
  objectiveId: string | number,
  tabId: string | number): AxiosPromise<Objective> =>
  request.private({
    method: 'delete',
    url: `household/${householdId}/objective/${objectiveId}/tab/${tabId}/complete`
  });


  /**
 * Get a list of completed tabs.
 * @param householdId
 * @param objectiveId
 */
export const getCompletedList = (householdId: string | number,
  objectiveId: string | number): AxiosPromise<any> =>
  request.private({
    method: 'get',
    url: `household/${householdId}/objective/${objectiveId}/completedTabs`
  });

  /**
 * Mark objective as selected.
 * @param householdId
 * @param objectiveId
 */
export const select = (householdId: string | number,
  objectiveId: string | number): AxiosPromise<Objective> =>
  request.private({
    method: 'put',
    url: `household/${householdId}/objective/${objectiveId}/select`
  });

/**
 * Remove objective from list of selected objectives.
 * @param householdId
 * @param objectiveId
 */
 export const unSelect = (householdId: string | number,
  objectiveId: string | number): AxiosPromise<Objective> =>
  request.private({
    method: 'delete',
    url: `household/${householdId}/objective/${objectiveId}/select`
  });


  /**
 * Get a list of selected objectives.
 * @param householdId
 */
export const getSelectedList = (householdId: string | number): AxiosPromise<any> =>
  request.private({
    method: 'get',
    url: `household/${householdId}/selectedObjectives`
  });

  /**
 * Get a list of selected objectives full.
 * @param householdId
 */
   export const getSelectedListFull = (householdId: string | number): AxiosPromise<Priority[]> =>
   request.private({
     method: 'get',
     url: `household/${householdId}/selectedObjectivesfull`
   });
