import {AxiosPromise} from "axios";
import request from "~/services/api/request";
import {InterviewResponse} from "~/types/api/interviewResponse";


/**
 * Get one by it's ID.
 * @param id
 */
export const get = (householdId: string | number,
                    interviewId: string | number,
                    id: string | number): AxiosPromise<InterviewResponse> =>
  request.private({
    method: 'get',
    url: `household/${householdId}/interview/${interviewId}/interviewresponse/${id}`,
  });

/**
 * Create a new one.
 * @param householdId
 * @param data
 */
export const create = (householdId: string | number,
                       interviewId: string | number,
                       questionId: string | number,
                       data: InterviewResponse): AxiosPromise<unknown> =>
  request.private({
    method: 'post',
    url: `household/${householdId}/interview/${interviewId}/question/${questionId}/interviewresponse`,
    data
  });

/**
 * Update an existing one.
 * @param householdId
 * @param interviewId
 * @param id
 * @param data
 */
export const update = (householdId: string | number,
                       interviewId: string | number,
                       id: string | number,
                       data: InterviewResponse): AxiosPromise<unknown> =>
  request.private({
    method: 'put',
    url: `household/${householdId}/interview/${interviewId}/interviewresponse/${id}`,
    data
  });

/**
 * Remove an existing one.
 * @param householdId
 * @param interviewId
 * @param id
 * @param data
 */
export const remove = (householdId: string | number,
                       interviewId: string | number,
                       id: string | number,
                       data: InterviewResponse): AxiosPromise<unknown> =>
  request.private({
    method: 'delete',
    url: `household/${householdId}/interview/${interviewId}/interviewresponse/${id}`,
    data
  });

/**
 * List all.
 * @param householdId
 * @param interviewId
 */
export const list = (householdId: string | number,
                     interviewId: string | number,
                     questionId: string | number): AxiosPromise<InterviewResponse[]> =>
  request.private({
    method: 'get',
    url: `household/${householdId}/interview/${interviewId}/question/${questionId}/interviewresponse/list`,
  });

/**
 * Add a response as being starred.
 * @param householdId
 * @param interviewId
 * @param interviewResponseId
 * 
 */
export const addStarred = (householdId: string | number,
    interviewId: string | number,
    interviewResponseId: string | number): AxiosPromise<unknown> => {
  return request.private({
  method: 'put',
  url: `household/${householdId}/interview/${interviewId}/interviewresponse/${interviewResponseId}/star`
  });
}

/**
* Remove from being starred.
* @param householdId
* @param interviewId
* @param interviewResponseId
*/
export const removeStarred = (householdId: string | number,
    interviewId: string | number,
    interviewResponseId: string | number): AxiosPromise<unknown> => {
  return request.private({
  method: 'delete',
  url: `household/${householdId}/interview/${interviewId}/interviewresponse/${interviewResponseId}/star`
  });
}

/**
 * Add a response as being starred.
 * @param householdId
 * @param interviewId
 * @param interviewResponseId
 * 
 */
export const addHidden = (householdId: string | number,
    interviewId: string | number,
    interviewResponseId: string | number): AxiosPromise<unknown> => {
  return request.private({
  method: 'put',
  url: `household/${householdId}/interview/${interviewId}/interviewresponse/${interviewResponseId}/hide`
  });
}

/**
* Remove from being starred.
* @param householdId
* @param interviewId
* @param interviewResponseId
*/
export const removeHidden = (householdId: string | number,
  interviewId: string | number,
  interviewResponseId: string | number): AxiosPromise<unknown> => {
return request.private({
  method: 'delete',
  url: `household/${householdId}/interview/${interviewId}/interviewresponse/${interviewResponseId}/hide`
  });
}
