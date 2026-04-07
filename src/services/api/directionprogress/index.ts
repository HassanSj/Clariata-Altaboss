import {AxiosPromise} from 'axios';
import request from '../request';
import { DirectionTask } from '~/types/api/directionTask';
import { update } from '../user';
import { updateChecklistItem } from '../destinychecklist';

/**
 * Mark DirectionTask as completed.
 * @param data
 */
export const complete = (householdId: string | number,
                       directionTaskID: string | number): AxiosPromise<DirectionTask> =>
  request.private({
    method: 'put',
    url: `directionprogress/${householdId}/directiontask/${directionTaskID}/complete`
  });

/**
 * Mark DirectionTask as uncompleted.
 * @param id
 */
export const remove = (householdId: string | number,
                       directionTaskID: string | number): AxiosPromise<unknown> =>
  request.private({
    method: 'delete',
    url: `directionprogress/${householdId}/directiontask/${directionTaskID}/complete`,
  });

/**
 * List household direction tasks
 */
export const list = (householdId: string | number): AxiosPromise<DirectionTask[]> =>
  request.private({
    method: 'get',
    url: `directionprogress/${householdId}/list`,
  });


