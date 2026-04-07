import { AxiosPromise } from 'axios';
import pl from 'date-fns/locale/pl';
import { PlanMember } from '~/types/api/destinyGlobalItem';
import { PlanMemberItem } from '~/types/api/planMemberItem';
import { PlanMemberItemSummary } from '~/types/api/planMemberItemSummary';
import request from '../request';

/**
* Get Plan member
* @param data
*/
export const getPlanMember = (personID: number, planId: number): AxiosPromise<PlanMember> =>
    request.private({
        method: 'get',
        url: `planmemberbyperson?PersonID=${personID}&DevelopmentPlanID=${planId}`
    });

/**
* Add Plan member
* @param data
*/
export const addPlanMember = (data: any): AxiosPromise<PlanMember> =>
    request.private({
        method: 'post',
        url: `planmember`, data
    });


/**
* Add Item to the member
* @param data
*/
export const addPlanMemberItem = (data: any): AxiosPromise<PlanMemberItem> =>
    request.private({
        method: 'post',
        url: `planmemberitem`, data
    });

/**
* Add Item to the entire family
* @param data
*/
export const addPlanMemberItemAll = (data: any): AxiosPromise<PlanMemberItem> =>
    request.private({
        method: 'post',
        url: `planmemberitems`, data
    });

/**
* Remove Item from the member
* @param data
*/
export const removePlanItems = (planmemberitemID: number): AxiosPromise<unknown> =>
    request.private({
        method: 'post',
        url: `archive?PlanMemberItemId=${planmemberitemID}`
    });

/**
* Remove Item from the member
* @param data
*/
export const removeAllFamilyPlanItem = (destinyId: number, planId: number): AxiosPromise<unknown> =>
    request.private({
        method: 'post',
        url: `archiveFamily?DestinyId=${destinyId}&PlanId=${planId}`
    });
    
/**
* Get Plan Member Item
* id
*/
export const getDevelopmentPlanItem = (planMemberItemId: number | undefined): AxiosPromise<PlanMemberItem> =>
    request.private({
        method: 'get',
        url: `planmemberitem?planmemberitemid=${planMemberItemId}`,
    });

/**

/**
* Get All Items list by Member 
* id
*/
export const itemsList = (developmentPlanID: number | undefined, householdId: number, personId: number): AxiosPromise<unknown> =>
    request.private({
        method: 'get',
        url: `planmemberitemsbyperson?DevelopmentPlanID=${developmentPlanID}&HouseholdID=${householdId}&PersonID=${personId}`,
    });


/**
* Get All Items list 
* id
*/
export const itemsListByPlanMemberID = (PlanMemberID: number): AxiosPromise<unknown> =>
    request.private({
        method: 'get',
        url: `planmemberitems?PlanMemberID=${PlanMemberID}`,
    });

/**
* Get All Items list 
* id
*/
export const itemsListByHouseholdID = (HouseholdID: number, DevelopmentPlanID: number | undefined): AxiosPromise<PlanMemberItem[]> =>
    request.private({
        method: 'get',
        url: `planmemberitemsbyhousehold?DevelopmentPlanID=${DevelopmentPlanID}&HouseholdID=${HouseholdID}`,
    });

/**
* Get All Items list 
* id
*/
export const itemsListCountByHouseholdID = (HouseholdID: number, DevelopmentPlanID: number | undefined): AxiosPromise<PlanMemberItemSummary[]> =>
    request.private({
        method: 'get',
        url: `planmemberitemcountbyhousehold?DevelopmentPlanID=${DevelopmentPlanID}&HouseholdID=${HouseholdID}`,
    });