import {AxiosPromise} from 'axios';
import request from '../request';


// https://us1.pdfgeneratorapi.com/api/v3/templates/{templateId}/output
/**
 * Get one by it's ID.
 * @param id
 */
 export const create = (templateId: number, fileName: string, hmac: any, data: any): AxiosPromise<unknown> =>
 request.private({
   method: 'post',
   headers: {
    'Authorization': `bearer ${hmac}` 
    },
   url: `https://us1.pdfgeneratorapi.com/api/v3/templates/${templateId}/output?name=${fileName}&format=pdf`,
   data
 });
