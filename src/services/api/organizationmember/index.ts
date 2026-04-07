import {AxiosPromise} from 'axios';
import request from '../request';
import {OrganizationMember} from "~/types/api/organizationMember";

/**
 * Get one by it's ID.
 * @param id
 */
export const get = (organizationId: string | number,
                    id: string | number): AxiosPromise<unknown> =>
    request.private({
        method: 'get',
        url: `organization/${id}`,
    });

/**
 * Create a new.
 * @param data
 */
export const create = (organizationId: string | number,
                       data: OrganizationMember): AxiosPromise<unknown> =>
    request.private({
        method: 'post',
        url: `organization${organizationId}/organizationmember`,
        data
    });

/**
 * Update an existing.
 * @param id
 * @param data
 */
export const update = (organizationId: string | number,
                       id: string | number,
                       data: OrganizationMember): AxiosPromise<unknown> =>
    request.private({
        method: 'put',
        url: `organization/${organizationId}/organizationmember/${id}`,
        data
    });

/**
 * Remove an existing.
 * @param id
 */
export const remove = (organizationId: string | number,
                       id: string | number,
                       data: OrganizationMember): AxiosPromise<unknown> =>
    request.private({
        method: 'delete',
        url: `organization/${organizationId}/organizationmember/${id}`,
        data
    });

/**
 * List all.
 */
export const list = (organizationId: string | number): AxiosPromise<unknown> =>
    request.private({
        method: 'get',
        url: `organization/${organizationId}/organizationmember/list`,
    });
