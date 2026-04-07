import {AxiosPromise} from 'axios';
import { Checklist } from '~/types/api/checklist';
import { ChecklistItem } from '~/types/api/checklistItem';
import request from '../request';

/**
 * Get all Checklists
 * @param data
 */
export const getAllChecklists = (): AxiosPromise<Checklist[]> =>
  request.private({
    method: 'get',
    url: `checklists`
  });

/**
 * Get a single Checklist
 * @param data
 */
 export const getOneChecklists = (checklistId:any): AxiosPromise<Checklist> =>
 request.private({
   method: 'get',
   url: `checklist?checklistId=${checklistId}`
 });


/**
 * Add a new checklist
 * @param data
 */
 export const addNewChecklist = (data:any): AxiosPromise<Checklist> =>
 request.private({
   method: 'post',
   url: `checklist`,
   data
 });

 /**
 * Delete a checklist
 * @param data
 */
  export const deleteChecklist = (checklistId:any): AxiosPromise<unknown> =>
  request.private({
    method: 'post',
    url: `DeleteChecklist?id=${checklistId}`
  });

 /**
 * Update a checklist
 * @param data
 */
  export const updateChecklist = (checklistId:any, data:any): AxiosPromise<Checklist> =>
  request.private({
    method: 'put',
    url: `checklist/${checklistId}`,
    data
  });

 /**
 * Get checklist items for a checklist
 * @param data
 */
  export const getChecklistItems = (checklistId:any): AxiosPromise<ChecklistItem[]> =>
  request.private({
    method: 'get',
    url: `checklistItems?checklistId=${checklistId}`
  });

  /**
 * Get a single checklist item for a checklist
 * @param data
 */
   export const getSingleChecklistItem = (checklistItemId:any): AxiosPromise<unknown> =>
   request.private({
     method: 'get',
     url: `checklistitem?id=${checklistItemId}`
   });

    /**
 * Add a checklist item for a checklist
 * @param data
 */
     export const addChecklistItem = (data:any): AxiosPromise<ChecklistItem> =>
     request.private({
       method: 'post',
       url: `checklistitem`,
       data
     });

  /**
 * Delete a checklist item for a checklist
 * @param data
 */
   export const deleteChecklistItem = (checklistItemId:any): AxiosPromise<unknown> =>
   request.private({
     method: 'post',
     url: `DeleteChecklistItem?id=${checklistItemId}`
   });

 /**
 * Update a checklist item for a checklist
 * @param data
 */
  export const updateChecklistItem = (checklistItemId:any, data:any): AxiosPromise<ChecklistItem> =>
  request.private({
    method: 'put',
    url: `checklistitem/${checklistItemId}`,
    data
  });