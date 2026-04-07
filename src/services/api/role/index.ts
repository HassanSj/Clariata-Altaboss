import {AxiosPromise} from "axios";
import request from "~/services/api/request";
import {Role} from "~/types/api/role";
import {Person} from "~/types/api/person";

const baseUrl = (householdId: number, personId: number) => `household/${householdId}/person/${personId}/role`

export const list = (householdId: number, personId: number): AxiosPromise<Role[]> =>
    request.private({
        method: "get",
        url: `${baseUrl(householdId,personId)}/list`
    })

export const create = (householdId: number, personId: number, data: Role): AxiosPromise<Role> => {
    return request.private({
        method: 'post',
        url: baseUrl(householdId,personId),
        data
    });
}

export const update = (householdId: number, personId: number, data: Role): AxiosPromise<Person> => {
    return request.private({
        method: 'put',
        url: `${baseUrl(householdId,personId)}/${data.RoleID}`,
        data
    });
}

export const remove = (householdId: number, personId: number, data: Role): AxiosPromise<unknown> => {
    return request.private({
        method: 'delete',
        url: `${baseUrl(householdId,personId)}/${data.RoleID}`,
        data
    });
}