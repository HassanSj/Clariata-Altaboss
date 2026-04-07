import axios, { AxiosPromise, AxiosRequestConfig } from 'axios';
import { DestinyChecklistItem } from '~/types/api/destinyChecklistItem';
import request from '../request';

const privateAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    "Access-Control-Allow-Origin": "*",
  }
});

/**
* Get Destiny Checklist item
 * @param data
**/
export const getChecklistItem = (id: number): AxiosPromise<DestinyChecklistItem[]> =>
    request.private({
      method: 'get',
      url: `destinychecklist?checklistId=${id}`,
    });

/**
* Create Destiny Checklist item
 * @param data
**/
export const createChecklistItem = (data: DestinyChecklistItem): AxiosPromise<DestinyChecklistItem> =>
request.private({
    method: 'post',
    url: `destinychecklistitem`, data
});

/**
 * Update an existing Subcategory.
 * @param id
 * @param data
 */
 export const updateChecklistItem = (id: number,
  data: DestinyChecklistItem): AxiosPromise<DestinyChecklistItem> =>
request.private({
method: 'put',
url: `checklistitem/${id}`,
data
});