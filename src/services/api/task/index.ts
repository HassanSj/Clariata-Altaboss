import { AxiosPromise } from 'axios';
import { Task } from '~/types/api/task';
import request from '../request';

/**
 * Get Tasks By Milestone
 */
export const getTasksByMilestone = (milestoneId: number): AxiosPromise<Task[]> =>
    request.private({
        method: 'get',
        url: `TasksByMilestone?milestoneId=${milestoneId}`,
    });

/**
 * Get Tasks By User
 */
 export const getTasksByUser = (userId: number): AxiosPromise<Task[]> =>
 request.private({
     method: 'get',
     url: `TasksByUser?userId=${userId}`,
 });

 /**
 * Get Past Due Tasks
 */
  export const getPastDueTasks = (): AxiosPromise<Task[]> =>
  request.private({
      method: 'get',
      url: `PastDueTasks`,
  });

 /**
 * Get Upcoming Tasks
 */
  export const getUpcomingTasks = (): AxiosPromise<Task[]> =>
  request.private({
      method: 'get',
      url: `UpcomingTasks`,
  });

/**
 * Get Task 
 */
 export const getTask = (taskId: number): AxiosPromise<Task> =>
 request.private({
     method: 'get',
     url: `Task?TaskID=${taskId}`,
 });

/**
* Create Task
 * @param data
*/
export const createTask = (data: Task): AxiosPromise<unknown> =>
    request.private({
        method: 'post',
        url: `task`, data
    });

    /**
* Update Task
 * @param data
*/
export const updateTask = (task: Task, householdId: number): AxiosPromise<unknown> =>
request.private({
    method: 'put',
    url: `task?TaskId=${task.TaskID}&householdId=${householdId}`,
    data: task
});

    /**
* Delete Task
 * @param data
*/
export const deleteTask = (taskId: number): AxiosPromise<unknown> =>
request.private({
    method: 'post',
    url: `DeleteTask?id=${taskId}`
});