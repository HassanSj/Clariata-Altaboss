import {AxiosPromise} from "axios";
import request from "~/services/api/request";
import {Timezone} from "~/types/api/timezone";

/**
 * Get a by it's ID.
 * @param id
 */
export const get = (id: string | number): AxiosPromise<Timezone> =>
  request.private({
    method: 'get',
    url: `timezone/${id}`,
  });

/**
 * List all.
 */
export const list = (): AxiosPromise<unknown> =>
  request.private({
    method: 'get',
    url: `timezone/list`,
  });
