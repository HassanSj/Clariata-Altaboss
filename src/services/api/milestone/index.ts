import { AxiosPromise } from 'axios';
import { Milestone } from '~/types/api/milestone';
import request from '../request';

/**
 * Get Milestones By Household 
 */
 export const getMilestonesByHousehold = (householdId: number): AxiosPromise<Milestone[]> =>
 request.private({
     method: 'get',
     url: `MilestoneByHousehold?householdId=${householdId}`,
 });


/**
 * Get Milestones By Priority/Objective 
 */
 export const getMilestonesByPriority = (priorityId: number): AxiosPromise<Milestone[]> =>
 request.private({
     method: 'get',
     url: `MilestoneByPriority?priorityId=${priorityId}`,
 });

/**
 * Get Milestones By Action Item 
 */
export const getMilestonesByActionItem = (actionItemId: number): AxiosPromise<Milestone[]> =>
    request.private({
        method: 'get',
        url: `MilestoneByActionItem?actionItemId=${actionItemId}`,
    });

/**
 * Get Milestone 
 */
 export const getMilestone = (milestoneId: number): AxiosPromise<Milestone[]> =>
 request.private({
     method: 'get',
     url: `Milestone?MilestoneID=${milestoneId}`,
 });

/**
* Create Milestone
 * @param data
*/
export const createMilestone = (data: Milestone): AxiosPromise<unknown> =>
    request.private({
        method: 'post',
        url: `milestone`, data
    });

    /**
* Delete Milestone
 * @param data
*/
export const deleteMilestone = (milestoneId: number): AxiosPromise<unknown> =>
request.private({
    method: 'delete',
    url: `Milestone?id=${milestoneId}`
});