import { AxiosPromise } from 'axios';
import { DestinySubcategory } from '~/types/api/destinySubcategory';
import request from '../request';

/**
 * Get All Subcategories 
 */
 export const getSubcategories = (): AxiosPromise<DestinySubcategory[]> =>
 request.private({
     method: 'get',
     url: `subcategories`,
 });

 /**
 * Get Subcategory
 */
  export const getSubcategory = (id: number): AxiosPromise<DestinySubcategory> =>
  request.private({
      method: 'get',
      url: `subcategory?subcategoryId=${id}`,
  });

  /**
 * Create Subcategory
 * @param data
*/
   export const Subcategory = (data: DestinySubcategory): AxiosPromise<DestinySubcategory> =>
   request.private({
    method: 'post',
    url: `subcategory`, data
});

/**
 * Update an existing Subcategory.
 * @param id
 * @param data
 */
 export const updateSubcategory = (id: string | number,
    data: DestinySubcategory): AxiosPromise<DestinySubcategory> =>
request.private({
method: 'put',
url: `subcategory/${id}`,
data
});

/**
* Delete Subcategory
 * @param data
*/
export const deleteSubcategory = (id: number): AxiosPromise<unknown> =>
request.private({
    method: 'post',
    url: `DeleteSubcategory?id=${id}`
});
