import { AxiosPromise } from 'axios';
import { DestinyGlobalItem } from '~/types/api/destinyGlobalItem';
import { PlanMemberItem } from '~/types/api/planMemberItem';
import request from '../request';

/**
 * Get All Global Items 
 */
export const getGlobalItems = (): AxiosPromise<DestinyGlobalItem[]> =>
    request.private({
        method: 'get',
        url: `globalitems`,
    });

/**
 * Get Global Item 
 */
 export const getGlobalItem = (itemId: number): AxiosPromise<DestinyGlobalItem> =>
 request.private({
     method: 'get',
     url: `globalitem?itemId=${itemId}`,
 });

/**
 * Get All Global Available Items 
 */
 export const getGlobalItemsAvailable = (planMemberID: number): AxiosPromise<DestinyGlobalItem[]> =>
 request.private({
     method: 'get',
     url: `globalitemsAvailable?planMemberID=${planMemberID}`,
 });

/**
* Create Global Destiny item
 * @param data
*/
export const createGlobalItem = (data: DestinyGlobalItem): AxiosPromise<DestinyGlobalItem> =>
    request.private({
        method: 'post',
        url: `globalitem`, data
    });

/**
 * Update an existing Destiny Item.
 * @param id
 * @param data
 */
export const updateGlobalItem = (id: string | number,
    data: DestinyGlobalItem): AxiosPromise<DestinyGlobalItem> =>
request.private({
method: 'put',
url: `globalitem/${id}`,
data
});

/**
* Delete Global Destiny item
 * @param data
*/
export const deleteGlobalItem = (itemId: number): AxiosPromise<unknown> =>
request.private({
    method: 'post',
    url: `DeleteGlobalItem?id=${itemId}`
});

/**
* Get all Advisor items 
*/
export const getAdvisorItems = (id: number): AxiosPromise<DestinyGlobalItem[]> =>
    request.private({
        method: 'get',
        url: `advisoritems?UserId=${id}`,
    });

   
/**
* Get all Advisor items 
 * @param id
 * @param data
*/
export const postAdvisorItems = (data: any, id: number): AxiosPromise<unknown> =>
    request.private({
        method: 'post',
        url: `globalitems`, data
    });

/**
* Get all Plan Member items by Family Member
*/
export const getPlanMemberItemsByPerson = (personId: number, planId: number, householdId: number): AxiosPromise<PlanMemberItem[]> =>
    request.private({
        method: 'get',
        url: `planmemberitemsbyperson?DevelopmentPlanID=${planId}&householdId=${householdId}&PersonId=${personId}`,
    });

/**
* Get all Plan Member items Assigned to All Family Members
*/
export const getPlanMemberItemsAssignedAll = (planId: number, householdId: number): AxiosPromise<PlanMemberItem[]> =>
    request.private({
        method: 'get',
        url: `planmemberallitems?PlanID=${planId}&householdId=${householdId}`,
    });
