import {AxiosPromise} from "axios";
import request from "~/services/api/request";

/**
 * Get a household's family tree.
 * @param householdId
 * @param excludeMarriage
 */
export const get = (householdId: string | number, excludeMarriage: boolean = false): AxiosPromise<any> =>
  request.private({
    method: 'get',
    url: `household/${householdId}/familytree?excludeMarriage=${excludeMarriage}`,
  });
