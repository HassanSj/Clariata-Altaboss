import { AxiosPromise } from 'axios';
import { Permission } from '~/types/api/permission';
import request from '../request';

/**
 * Get Permission List
 */
export const list = (): AxiosPromise<Permission[]> =>
    request.private({
        method: 'get',
        url: `permission/list`,
    });
