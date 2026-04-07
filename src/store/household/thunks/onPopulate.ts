import {thunk, Thunk, useStoreState} from 'easy-peasy';
import {AxiosResponse} from 'axios';
import api from 'services/api';

import {processServerError} from 'services/api/errors';
import {IHouseholdStoreModel} from "~/types/household/store";
import {Household} from "~/types/api/household";
import {Person} from "~/types/api/person";
import {PersonType} from "~/ui/constants/api";
import {populatePhotos} from "~/ui/constants/person";
import {populateHouseholdDirectionTaskProgress, populateHouseholdPhotos} from "~/ui/constants/household";

const onPopulate: Thunk<IHouseholdStoreModel, null> = thunk(async ({ populate }, payload) => {
  try {
    const res: AxiosResponse = await api.household.list();
    console.log(res.status);
    // Populate household persons
    // TODO: Check this
    if (res.data) {
      await Promise.all(res.data.map(async (h: Household) => {
        h.Persons = [];
        if (h?.HouseholdID) {
          const personsResp: AxiosResponse = await api.person.list(h?.HouseholdID);
          if (personsResp.data) {
            h.Persons = personsResp.data.filter((person: Person) => ([PersonType.PRIMARY] || [PersonType.HOUSEHOLD])
              .some((type) => type === person.PersonTypeID));
            // Populate photos
            try {
              if (h.Persons) {
                await Promise.all(h.Persons.map(async (person: Person) => {
                  await populatePhotos(person);
                }));
              }
            } catch (e) {
              processServerError(e, 'household.onPopulate.person.photo');
            }
          }
        }
        // Populate photos
        h = await populateHouseholdPhotos(h);
        h = await populateHouseholdDirectionTaskProgress(h);
      }));
    }
    populate(res.data);
    
  } catch (err) {
    processServerError(err, 'household.onPopulate');
  }
});

export default onPopulate;
