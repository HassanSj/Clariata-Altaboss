import axios, { AxiosPromise, AxiosRequestConfig } from 'axios';
import { DestinyGlobalItem } from '~/types/api/destinyGlobalItem';
import { PlanMemberChecklist } from '~/types/api/planMemberChecklist';
import { PlanMemberItem } from '~/types/api/planMemberItem';
import request from '../request';

const privateAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    "Access-Control-Allow-Origin": "*",
  }
});

/**
* Get Plan Member Checklist
 * @param data
**/
export const getPlanMemberChecklist = (id: number): AxiosPromise<PlanMemberChecklist[]> =>
    request.private({
      method: 'get',
      url: `planmemberchecklist?planMemberItemId=${id}`,
    });

/**
 * Update an existing Plan Member Checklist.
 * @param id
 * @param data
 */
 export const updatePlanMemberChecklist = (id: number,
  data: PlanMemberChecklist): AxiosPromise<PlanMemberChecklist> =>
request.private({
method: 'put',
url: `planmemberchecklist/${id}`,
data
});