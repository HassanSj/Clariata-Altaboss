import { AxiosPromise } from 'axios';
import request from '../request';

/**
 * Uploads a file to S3 bucket
*/

export const uploadResourceFile = (file:any): AxiosPromise<unknown> =>{
  return request.private({
    method: 'post',
    url: `Document`,
    headers: {
        "Content-Type" : 'multipart/form-data'
    },
    data:file
  });
}

/**
 * Deletes a file from S3 bucket
*/

export const deleteResourceFile = (fileName:string): AxiosPromise<unknown> =>{
  return request.private({
    method: 'delete',
    url: `Document?objectKey=${fileName}`
  });
}

/**
 * Gets data for a file from S3 bucket
*/

export const getResourceFile = (fileName:string): AxiosPromise<any> =>{
  return request.private({
    method: 'get',
    url: `Document?documentName=${fileName}`
  });
}
