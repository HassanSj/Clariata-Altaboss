import { AxiosPromise } from 'axios';
import { DevelopmentPlan } from '~/types/api/developmentPlan';
import request from '../request';

/**
 * Get All Development Plans by Family 
 * id
 */
export const getDevelopmentPlans = (id: number): AxiosPromise<DevelopmentPlan[]> =>
    request.private({
        method: 'get',
        url: `developmentplans?HouseholdId=${id}`,
    });

/**
 * Get Development Plan 
 * id
 */
 export const getDevelopmentPlan = (id: number): AxiosPromise<DevelopmentPlan> =>
 request.private({
     method: 'get',
     url: `developmentplan?DevelopmentPlanID=${id}`,
 });

/**
* Create Development Plan 
* @param data
*/
export const createDevelopmentPlan = (data: any): AxiosPromise<DevelopmentPlan> =>
    request.private({
        method: 'post',
        url: `developmentplan`,
        data
    });