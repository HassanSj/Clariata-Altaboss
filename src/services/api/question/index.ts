import {AxiosPromise} from "axios";
import request from "~/services/api/request";
import {Question} from "~/types/api/question";

/**
 * Get one by it's id.
 * @param interviewTemplateId
 * @param id
 */
export const get = (interviewTemplateId: string | number, id: string | number): AxiosPromise<unknown> => {
  return request.private({
    method: 'get',
    url: `interviewtemplate/${interviewTemplateId}/question/${id}`,
  });
}

/**
 * List all questions for a template.
 * @param interviewTemplateId
 */
export const listDiscoverCategoryQuestions = (interviewTemplateId: string | number,
                                              dimensionOfSuccessId: number,
                                              includeSubQuestions: boolean): AxiosPromise<unknown> => {
  const params = `dimensionOfSuccessId=${dimensionOfSuccessId}&includeSubQuestions=${includeSubQuestions}`;
  return request.private({
    method: 'get',
    url: `interviewtemplate/${interviewTemplateId}/question/list?${params}`,
  });
}

/**
 * List all questions for a template.
 * @param interviewTemplateId
 */
export const listDiscoverQuestions = (interviewTemplateId: string | number,
                                      dimensionOfSuccessId: number,
                                      metricOfSuccessId: number,
                                      includeSubQuestions: boolean): AxiosPromise<unknown> => {
  const params = `dimensionOfSuccessId=${dimensionOfSuccessId}&metricOfSuccessId=${metricOfSuccessId}&includeSubQuestions=${includeSubQuestions}`;
  return request.private({
    method: 'get',
    url: `interviewtemplate/${interviewTemplateId}/question/list?${params}`,
  });
}

/**
 * List all questions for a template.
 * @param interviewTemplateId
 */
export const listDreamQuestions = (interviewTemplateId: string | number,
                                   dimensionOfSuccessId: number,
                                   metricOfSuccessId: number): AxiosPromise<unknown> => {
  const params = `dimensionOfSuccessId=${dimensionOfSuccessId}&metricOfSuccessId=${metricOfSuccessId}&includeSubQuestions=true`;
  return request.private({
    method: 'get',
    url: `interviewtemplate/${interviewTemplateId}/question/list?${params}`,
  });
}

/**
 * Add a question as being starred.
 * @param householdId
 * @param id
 */
export const addStarred = (householdId: string | number,
                           id: string | number,
                           data: Question): AxiosPromise<unknown> => {
  return request.private({
    method: 'put',
    url: `household/${householdId}/question/${id}/star`,
    data
  });
}

/**
 * Remove from being starred.
 * @param householdId
 * @param id
 */
export const removeStarred = (householdId: string | number,
                              id: string | number,
                              data: Question): AxiosPromise<unknown> => {
  return request.private({
    method: 'delete',
    url: `household/${householdId}/question/${id}/star`,
    data
  });
}