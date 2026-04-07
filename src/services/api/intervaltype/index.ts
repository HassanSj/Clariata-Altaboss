import {AxiosPromise} from 'axios';
import request from '../request';
import {IntervalType} from "~/types/api/intervalType";

/**
 * List all.
 */
export const list = (): AxiosPromise<IntervalType[]> =>
  request.private({
    method: 'get',
    url: `intervaltype/list`,
  });
