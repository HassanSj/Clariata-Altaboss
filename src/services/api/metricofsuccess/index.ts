import {AxiosPromise} from 'axios';
import request from '../request';
import {MetricOfSuccess} from "~/types/api/metricOfSuccess";

/**
 * List all.
 */
export const list = (): AxiosPromise<MetricOfSuccess[]> =>
  request.private({
    method: 'get',
    url: `metricofsuccess/list`,
  });
