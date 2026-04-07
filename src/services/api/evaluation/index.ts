import {AxiosPromise} from 'axios';
import request from '../request';
import {ClientEvaluation} from "~/types/api/clientEvaluation";
import {IPatchUpdate} from "~/types/api";

/**
 * Get an evaluation by it's ID.
 * @param id
 */
export const get = (id: string | number): AxiosPromise<unknown> =>
  request.private({
    method: 'get',
    url: `clientevaluation/${id}`,
  });

/**
 * Create a new evaluation.
 * @param data
 */
export const create = (data: ClientEvaluation): AxiosPromise<unknown> =>
  request.private({
    method: 'post',
    url: `clientevaluation`,
    data
  });

/**
 * Update an existing evaluation.
 * @param id
 * @param data
 */
export const update = (id: string | number, data: ClientEvaluation): AxiosPromise<unknown> =>
  request.private({
    method: 'put',
    url: `clientevaluation/${id}`,
    data
  });

/**
 * Perform patch updates.
 * @param id
 * @param data
 */
export const patch = (id: string | number, data: IPatchUpdate[]): AxiosPromise<unknown> =>
  request.private({
    method: 'patch',
    url: `clientevaluation/${id}`,
    data
  });

/**
 * Remove an existing evaluation.
 * @param id
 */
export const remove = (id: string | number, data: ClientEvaluation): AxiosPromise<unknown> =>
  request.private({
    method: 'delete',
    url: `clientevaluation/${id}`,
    data
  });

/**
 * List all of a user's evaluations.
 */
export const list = (): AxiosPromise<unknown> =>
  request.private({
    method: 'get',
    url: `clientevaluation/list`,
  });