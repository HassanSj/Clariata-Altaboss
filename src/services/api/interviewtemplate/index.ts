import {AxiosPromise} from "axios";
import request from "~/services/api/request";

/**
 * List interview templates.
 */
export const list = (): AxiosPromise<unknown> =>
  request.private({
    method: 'get',
    url: `interviewtemplate/list`,
  });
