import {AxiosPromise} from 'axios';
import request from '../request';
import {QuestionCategory} from "~/types/api/questionCategory";

/**
 * List all.
 */
export const list = (): AxiosPromise<QuestionCategory[]> =>
  request.private({
    method: 'get',
    url: `discovercategory/list`,
  });
