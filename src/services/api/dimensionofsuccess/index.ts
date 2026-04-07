import {AxiosPromise} from 'axios';
import request from '../request';
import {DimensionOfLife} from "~/types/api/dimensionOfLife";

/**
 * List all.
 */
export const list = (): AxiosPromise<DimensionOfLife[]> =>
  request.private({
    method: 'get',
    url: `dimensionoflife/list`,
  });
