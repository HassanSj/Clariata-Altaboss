import {thunk, Thunk} from 'easy-peasy';
import {AxiosResponse} from 'axios';
import api from 'services/api';

import {processServerError} from 'services/api/errors';
import {IPersonStoreModel} from "~/types/person/store";
import {Person} from "~/types/api/person";
import {populatePhotos} from "~/ui/constants/person";

interface IPayload {
  HouseholdID?: string;
}
const onPopulate: Thunk<IPersonStoreModel, IPayload> = thunk(async ({ populate }, payload: IPayload, helpers) => {
  const store: any = helpers.getStoreState();
  if (!store?.selected?.householdId){
    return;
  }
  try {
    const res: AxiosResponse = await api.person.list(store?.selected?.householdId);
    // Set full names
    if (res?.data) {
      await Promise.all(res.data.map(async (person: Person) => {
        person.FullName = `${person?.FirstName} ${person?.LastName}`;
        person = await populatePhotos(person);
      }));
    }
    populate(res.data);
  } catch (err) {
    processServerError(err, 'household.onPopulate');
  }
});

export default onPopulate;
