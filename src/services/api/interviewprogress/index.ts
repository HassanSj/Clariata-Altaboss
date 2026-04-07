import {AxiosPromise} from "axios";
import request from "~/services/api/request";
import { InterviewProgress } from "~/types/api/interviewProgress";

/**
 * Get one by it's ID.
 * @param id
 */
export const get = (householdId: string | number, id: string | number): AxiosPromise<unknown> =>
  request.private({
    method: 'get',
    url: `household/${householdId}/interviewprogress/${id}`,
  });

/**
 * Get discover additional progress by it's ID.
 * @param id
 */
 export const getDiscoverAdditional = (householdId: string | number, id: string | number): AxiosPromise<unknown> =>
 request.private({
   method: 'get',
   url: `household/${householdId}/discoverprogress/${id}`,
 });

/**
 * Get get all by householdId
 */
 export const getFull = (householdId: string | number): AxiosPromise<Array<InterviewProgress>> =>
 request.private({
   method: 'get',
   url: `household/${householdId}/interviewprogress`,
 });