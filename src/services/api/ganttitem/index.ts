import { AxiosPromise } from 'axios';
import { GanttItem } from '~/types/api/ganntItem';
import request from '../request';

/**
 * Get GanttItems By Household 
 */
 export const getGanttItemsyHousehold = (householdId: number): AxiosPromise<GanttItem[]> =>
 request.private({
     method: 'get',
     url: `GanttItemsByHousehold?householdId=${householdId}`,
 });


/**
 * Get GanttItems By Priority/Objective 
 */
 export const getGanttItemsByPriority = (priorityId: number): AxiosPromise<GanttItem[]> =>
 request.private({
     method: 'get',
     url: `GanttItemsByPriority?priorityId=${priorityId}`,
 });

/**
 * Get GanttItems By Action Item 
 */
export const getGanttItemsByActionItem = (actionItemId: number): AxiosPromise<GanttItem[]> =>
    request.private({
        method: 'get',
        url: `GanttItemsByActionItem?actionItemId=${actionItemId}`,
    });