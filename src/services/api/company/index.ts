import {AxiosPromise} from "axios";
import request from "~/services/api/request";
import {Company} from "~/types/api/company";

const baseUrl = (householdId: number, personId: number) => `household/${householdId}/person/${personId}/company`

export const list = (householdId: number, personId: number): AxiosPromise<Company[]> =>
    request.private({
        method: "get",
        url: `${baseUrl(householdId,personId)}/list`
    })

export const create = (householdId: number, personId: number, data: Company): AxiosPromise<Company> => {
    return request.private({
        method: 'post',
        url: baseUrl(householdId,personId),
        data
    });
}

export const update = (householdId: number, personId: number, data: Company): AxiosPromise<Company> => {
    return request.private({
        method: 'put',
        url: `${baseUrl(householdId,personId)}/${data.CompanyID}`,
        data
    });
}

export const remove = (householdId: number, personId: number, data: Company): AxiosPromise<unknown> => {
    return request.private({
        method: 'delete',
        url: `${baseUrl(householdId,personId)}/${data.CompanyID}`,
        data
    });
}