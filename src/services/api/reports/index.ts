import {AxiosPromise} from "axios";
import request from "~/services/api/request";

export const getInterviewReport = (householdId: string | number,
                                   interviewId: string | number): AxiosPromise<unknown> => {
  return request.private({
    method: 'get',
    url: `household/${householdId}/interview/${interviewId}/report`,
  });
}

export const getObjectiveSignificance = (householdId: string | number,
                                   interviewId: string | number): AxiosPromise<unknown> => {
  return request.private({
    method: 'get',
    url: `household/${householdId}/interview/${interviewId}/objectivesignificance/report`,
  });
}

export const getPriorityGrid = (householdId: string | number,
                                         interviewId: string | number): AxiosPromise<unknown> => {
  return request.private({
    method: 'get',
    url: `household/${householdId}/interview/${interviewId}/prioritygrid/report`,
  });
}

export const getPriorityGridExcel = (householdId: string | number,
                                interviewId: string | number): AxiosPromise<unknown> => {
  return request.private({
    method: 'get',
    url: `household/${householdId}/interview/${interviewId}/prioritygrid/excel`,
  });
}

export const getVisionMissionCoreValues = (householdId: string | number,
                                     interviewId: string | number): AxiosPromise<unknown> => {
  return request.private({
    method: 'get',
    url: `household/${householdId}/interview/${interviewId}/visionmissioncorevalues/report`,
  });
}

export const getLifeChart = (householdId: string | number,
                                           interviewId: string | number): AxiosPromise<unknown> => {
  return request.private({
    method: 'get',
    url: `household/${householdId}/interview/${interviewId}/lifechart/report`,
  });
}

export const getFamilyStoryReport = (householdId: string | number | undefined,
  interviewId: string | number | undefined): AxiosPromise<unknown> => {
return request.private({
method: 'get',
url: `household/${householdId}/interview/${interviewId}/familystoryreport`,
});
}
