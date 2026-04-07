import {AxiosPromise, AxiosResponse} from 'axios';
import request from '../request';
import {buildOwnerUrl, getHttpMethod} from "~/ui/constants/person";
import {OwnerParams} from "~/types/relations";
import {OwnerModelType} from "~/ui/constants/api";
import {ClariataModule} from "~/types/api/clariataModule";

/**
 * Get an module by it's Name.
 * @param name
 */
export const get = (name: string): AxiosPromise<ClariataModule> =>
  request.private({
    method: 'get',
    url: `module/${name}`,
  });