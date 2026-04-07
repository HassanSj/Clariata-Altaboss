import {AxiosPromise} from "axios";
import request from "~/services/api/request";
import { TimelineItem } from "~/types/api/timelineItem";


/**
 * Get one by it's ID.
 * @param householdId
 * @param timelineId
 * @param timelineItemId
 */
export const get = (householdId: string | number,
                    timelineId: string | number,
                    timelineItemId: string | number): AxiosPromise<TimelineItem> =>
  request.private({
    method: 'get',
    url: `/household/${householdId}/timelineItem/${timelineItemId}`,
  });

/**
 * Create a new one.
 * @param householdId
 * @param timelineId
 * @param data
 */
export const create = (householdId: string | number,
                       timelineId: string | number,
                       data: TimelineItem): AxiosPromise<unknown> =>
  request.private({
    method: 'post',
    url: `/household/${householdId}/timelineitem`,
    data
  });

/**
 * Update an existing one.
 * @param householdId
 * @param timelineId
 * @param timelineItemId
 * @param data
 */
export const update = (householdId: string | number,
                       timelineId: string | number,
                       timelineItemId: string | number,
                       data: TimelineItem): AxiosPromise<unknown> =>
  request.private({
    method: 'put',
    url: `/household/${householdId}/timelineItem/${timelineItemId}`,
    data
  });

/**
 * Remove an existing one.
 * @param householdId
 * @param timelineId
 * @param timelineItemId
 */
export const remove = (householdId: string | number,
                       timelineId: string | number,
                       timelineItemId: string | number): AxiosPromise<unknown> =>
  request.private({
    method: 'delete',
    url: `/household/${householdId}/timelineItem/${timelineItemId}`,
  });

/**
 * List all.
 * @param householdId
 * @param timelineId
 */
export const list = (householdId: string | number,
                     timelineId: string | number): AxiosPromise<TimelineItem[]> =>
  request.private({
    method: 'get',
    url: `/household/${householdId}/timelineitem/list`,
  });