import {AxiosPromise, AxiosResponse} from "axios";
import request from "~/services/api/request";
import {Household} from "~/types/api/household";
import api from "~/services/api";
import {Person} from "~/types/api/person";
import {PersonType} from "~/ui/constants/api";
import {populatePhotos} from "~/ui/constants/person";
import {processServerError} from "~/services/api/errors";
import {Company} from "~/types/api/company";

/**
 * Get a household by it's ID.
 * @param id
 */
export const get = (id: string | number): AxiosPromise<Household> =>
  request.private({
    method: 'get',
    url: `household/${id}`,
  });

/**
 * Get a household w/ all additional values populated (ex. persons).
 * @param id
 */
export const getFull = async (id: string | number): Promise<Household> => {
  const householdResp = await get(id);
  const household: Household = householdResp.data;
  const personsResp: AxiosResponse = await api.person.list(id);
  if (personsResp.data) {
    household.Persons = personsResp.data.filter((person: Person) => [PersonType.PRIMARY]
      .some((type) => type === person.PersonTypeID));
    // Populate photos
    try {
      if (household.Persons) {
        const promises: any = [];
        household.Persons.forEach((person: Person) => {
          promises.push(populatePhotos(person).then((p: Person) => person = p));
        });
        await Promise.all(promises);
      }
    } catch (e) {
      processServerError(e, 'household.onPopulate.person.photo');
    }
  }

  return household;
}


/**
 * Create a new household.
 * @param data
 */
export const create = (data: Household): AxiosPromise<Household> =>
  request.private({
    method: 'post',
    url: `household`,
    data
  });

/**
 * Update an existing household.
 * @param id
 * @param data
 */
export const update = (id: string | number, data: Household): AxiosPromise<Household> =>
  request.private({
    method: 'put',
    url: `household/${id}`,
    data
  });

/**
 * Remove an existing household.
 * @param id
 */
export const remove = (id: string | number, data: Household): AxiosPromise<unknown> =>
  request.private({
    method: 'delete',
    url: `household/${id}`,
    data
  });

/**
 * List all of a user's households.
 */
export const list = (): AxiosPromise<unknown> =>
  request.private({
    method: 'get',
    url: `household/list`,
  });

/**
 * Get list of all users that have shared access to household.
 * @param id
 * @param data
 */
export const listSharedUsers = (id: string | number): AxiosPromise<unknown> =>
  request.private({
    method: 'get',
    url: `household/${id}/user/list`,
  });

/**
 * Get list of all companies for this household.
 * @param householdId
 * @param people
 */
export const listCompanies = async (householdId: number, people: Person[]): Promise<Company[]> => {
    return (await Promise.all(people.map(async person => {
        const data = await api.company.list(householdId, person.PersonID)
        return data.data
    }))).flatMap(it => it)
}
