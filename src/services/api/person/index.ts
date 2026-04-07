import {AxiosPromise} from 'axios';
import request from '../request';
import {Person} from "~/types/api/person";
import {getFullName, getInitials} from "~/ui/constants/user";
import {OwnerParams} from "~/types/relations";
import {buildOwnerUrl, getHttpMethod, populatePhotos} from "~/ui/constants/person";
import {OwnerModelType} from "~/ui/constants/api";

const MODEL = OwnerModelType.PERSON;

/**
 * Get an contact by it's ID.
 * @param id
 */
export const get = (id: string | number, householdID: number): AxiosPromise<Person> =>
  request.private({
    method: 'get',
    url: `household/${householdID}/person/${id}`,
  });

/**
 * Get an contact by it's ID w/ photos and other relations populated.
 * @param id
 */
export const getFull = async (id: string | number, householdID: number): Promise<Person> => {
  const data = await get(id, householdID);
  let person = data?.data;
  if(person) {
    person.FullName = `${person?.FirstName} ${person?.LastName}`;
    person = await populatePhotos(person);
  }
  
  return person;
}

/**
 * Create if no modelId is found. Otherwise, update.
 * @param data
 */
export const createOrUpdate = (ownerParams: OwnerParams,
                               data: Person): AxiosPromise<Person> => {
  if (data) data.PersonStatusID = 1; // set to active
  return request.private({
    method: getHttpMethod(ownerParams),
    url: buildOwnerUrl(ownerParams),
    data
  });
}

/**
 * Create a new contact.
 * @param data
 */
export const create = (ownerParams: OwnerParams, data: any): AxiosPromise<Person> => {
  if (data) data.PersonStatusID = 1; // set to active
  return request.private({
    method: 'post',
    url: buildOwnerUrl(ownerParams),
    data
  });
}

/**
 * Update an existing contact.
 * @param id
 * @param data
 */
export const update = (ownerParams: OwnerParams, data: any): AxiosPromise<Person> => {
  if (data) data.PersonStatusID = 1; // set to active
  return request.private({
    method: 'put',
    url: buildOwnerUrl(ownerParams),
    data
  });
}

/**
 * Remove an existing contact.
 * @param id
 */
export const remove = (ownerParams: OwnerParams, data: Person): AxiosPromise<unknown> =>
  request.private({
    method: 'delete',
    url: buildOwnerUrl(ownerParams),
    data
  });

/**
 * List all contacts.
 */
export const list = (householdId: string | number): AxiosPromise<Person[]> =>
  request.private({
    method: 'get',
    url: `household/${householdId}/person/list`,
  }).then ((resp) => {
    if (resp?.data) {
      resp?.data?.forEach((person: Person) => {
        person.FullName = getFullName(person);
        person.Initials = getInitials(person);
      })
    }
    return resp;
  });

/**
 * Create a new child.
 * @param data
 */
export const createChild = (householdID: number, personId: number, data: any): AxiosPromise<Person> => {
  if (data) data.PersonStatusID = 1; // set to active
  return request.private({
    method: 'post',
    url: `household/${householdID}/person/${personId}/child`,
    data
  });
}
