import {AxiosPromise, AxiosResponse} from "axios";
import request from "~/services/api/request";
import {Interview} from "~/types/api/interview";
import api from "~/services/api";
import {InterviewFull} from "~/types/api/interviewFull";

/**
 * Get one by it's ID.
 * @param id
 */
export const get = (householdId: string | number, id: string | number): AxiosPromise<unknown> =>
  request.private({
    method: 'get',
    url: `household/${householdId}/interview/${id}`,
  });

/**
 * Get one by it's ID.
 * @param id
 */
export const getFull = async (householdId: string | number, id: string | number): Promise<InterviewFull> => {
  const res = await request.private({
    method: 'get',
    url: `household/${householdId}/fullinterview/${id}`,
  });

  if (!res?.data) {
    return Promise.resolve(res?.data);
  }

  // Loop and enhance each template
  const interview: InterviewFull = res.data;
  const promises: any = [];

  // Progress
  promises.push(
    await api.interviewprogress.get(interview.Interview.HouseholdID, interview.Interview.InterviewID).then(async (resp: AxiosResponse) => {
      interview.Progress = resp.data
    })
  );

  promises.push(
    await api.interviewprogress.getDiscoverAdditional(interview.Interview.HouseholdID, interview.Interview.InterviewID).then(async (resp: AxiosResponse) => {
      interview.AdditionalCategoryProgressList = resp.data
    })
  );

  return Promise.all(promises).then(() => interview);
}

/**
 * Create a new one.
 * @param data
 */
export const create = (householdId: string | number, data: Interview): AxiosPromise<unknown> =>
  request.private({
    method: 'post',
    url: `household/${householdId}/interview`,
    data
  });

/**
 * Update an existing one.
 * @param id
 * @param data
 */
export const update = (householdId: string | number, id: string | number, data: Interview): AxiosPromise<unknown> =>
  request.private({
    method: 'put',
    url: `household/${householdId}/interview/${id}`,
    data
  });

/**
 * Remove an existing one.
 * @param id
 */
export const remove = (householdId: string | number, id: string | number, data: Interview): AxiosPromise<unknown> =>
  request.private({
    method: 'delete',
    url: `household/${householdId}/interview/${id}`,
    data
  });

/**
 * List all.
 * @param householdId
 */
export const list = (householdId: string | number): AxiosPromise<unknown> =>
  request.private({
    method: 'get',
    url: `household/${householdId}/interview/list`,
  })

/**
 * List all w/ fully populated interviews.
 * @param householdId
 */
export const listFull = async (householdId: string | number): Promise<InterviewFull[]> => {

  // Fetch base list of interviews
  const resp = await request.private({
    method: 'get',
    url: `household/${householdId}/interview/list`,
  });

  // Loop and enhance each template
  const promises: any = [];
  const result: InterviewFull[] = []

  if (resp?.data) {
    const { data } = await api.interviewtemplate.list();
    resp.data.forEach((interview: any) => {
      const fullInterview: InterviewFull = {
        Interview: interview
      };
      promises.push(api.interviewprogress.get(interview.HouseholdID, interview.InterviewID)
        .then(async (progressRes: AxiosResponse) => {
          fullInterview.Progress = progressRes.data;
          fullInterview.InterviewTemplate = data && (data instanceof Array) ? data.find((t: any) => t.InterviewTemplateID === interview.InterviewTemplateID) : undefined;
          // result.push(fullInterview);
          // return result;
        }));
      promises.push(api.interviewprogress.getDiscoverAdditional(interview.HouseholdID, interview.InterviewID)
        .then(async (progressRes: AxiosResponse) => {
          fullInterview.AdditionalCategoryProgressList = progressRes.data;
          // fullInterview.InterviewTemplate = data && (data instanceof Array) ? data.find((t: any) => t.InterviewTemplateID === interview.InterviewTemplateID) : undefined;
          result.push(fullInterview);
          return result;
        }));
    });
  };

  return Promise.all(promises).then(() => result);
}
