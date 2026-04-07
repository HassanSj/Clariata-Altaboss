import {ReportPdf} from "~/types/api/reportpdf";
import {AxiosPromise} from "axios";
import request from "~/services/api/request";

export const create = (householdID: number, data: ReportPdf):AxiosPromise<unknown> => {
    return request.private({
        method: "post",
        url: `household/${householdID}/reportpdf`,
        data
    });
}

export const remove = (householdID: number, pdfID: number): AxiosPromise<unknown> => {
    return request.private({
        method: "delete",
        url: `household/${householdID}/reportpdf/${pdfID}`
    });
}

export const get = (householdID: number, pdfID: number): AxiosPromise<unknown> => {
    return request.private({
        method: "get",
        url: `household/${householdID}/reportpdf/${pdfID}`
    });
}