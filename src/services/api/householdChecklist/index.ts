import { AxiosPromise } from 'axios';
import request from '../request';
import { Resource } from '~/types/api/resource';
import { HouseholdChecklist } from '~/types/api/householdChecklist';

/**
 * Get a household checklist
*/
export const getHouseholdChecklist = (householdId:number, checklistId:number): AxiosPromise<HouseholdChecklist> =>
  request.private({
    method: 'get',
    url: `householdchecklist?householdId=${householdId}&checklistId=${checklistId}`,
  });

/**
 * Delete a household checklist
*/

export const deleteHouseholdChecklist = (checklistId:number): AxiosPromise<unknown> =>
  request.private({
    method: 'post',
    url: `DeleteHouseholdChecklist?id=${checklistId}`,
  });

/**
 * Update a household checklist item
*/
export const updateHouseholdChecklistItem = (householdChecklistItemId: number, data: any): AxiosPromise<unknown> =>
  request.private({
    method: 'put',
    url: `householdchecklistitem/${householdChecklistItemId}`,
    data,
  });
