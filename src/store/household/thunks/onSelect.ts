import {thunk, Thunk} from 'easy-peasy';

import {Household} from 'types/api/household';
import {IHouseholdStoreModel} from "~/types/household/store";
import {processServerError} from "~/services/api/errors";
import {UserSettingType} from "~/ui/constants/settings";
import {Person} from "~/types/api/person";
import {PersonType} from "~/ui/constants/api";
import {InterviewDataType} from "~/ui/constants/interview";
import {AxiosResponse} from "axios";
import api from "~/services/api";
import paths from "~/ui/constants/paths";
import {NextRouter} from "next/router";
import {populatePhotos} from "~/ui/constants/person";
import {populateHouseholdDirectionTaskProgress, populateHouseholdPhotos} from "~/ui/constants/household";
import {IObjectiveDataType} from "~/types/objective/store";

const { DASHBOARD } = paths;

interface IPayload {
  household: Household | null;
  router: NextRouter;
}

const onSelect: Thunk<IHouseholdStoreModel, IPayload> = thunk(async ({ select }, payload, helpers) => {
  const actions: any = helpers.getStoreActions();
  const householdId = payload?.household?.HouseholdID;

  try {
    // Set loading
    actions.layout.setLoading(true);

    if (payload?.household && payload?.household?.HouseholdID) {

      // Fetch household persons
      try {
        const personsResp: AxiosResponse = await api.person.list(payload?.household?.HouseholdID);
        if (personsResp.data) {
          payload.household.Persons = personsResp.data.filter((person: Person) => [PersonType.PRIMARY]
            .some((type) => type === person.PersonTypeID));
          if (payload.household.Persons) {
            await Promise.all(payload.household.Persons.map(async (person: Person) => {
              await populatePhotos(person);
            }))
          }
        }
      } catch (err){
        processServerError(err, 'household.onSelect');
      }

      // Fetch household users
      try {
        const usersResp: AxiosResponse = await api.household.listSharedUsers(payload?.household?.HouseholdID);
        payload.household.Users = usersResp.data;
      } catch (err){
        processServerError(err, 'household.onSelect');
      }

    }

    // Populate images
    if (payload?.household) {
      payload.household = await populateHouseholdPhotos(payload.household);
    }

    // Populate direction tasks
    if (payload?.household) {
      payload.household = await populateHouseholdDirectionTaskProgress(payload.household);
    }


    // Set household
    select(payload.household);

    // Update setting
    actions.user.onUpdateSetting({
      name: UserSettingType.SelectedHouseholdID,
      value: payload?.household?.HouseholdID
    });

    // Reset household-specific state
    await actions.evaluation.onClear();
    await actions.person.onClear();
    await actions.interview.onClear({ type: InterviewDataType.ALL });
    await actions.objective.onClear({ type: IObjectiveDataType.ALL });
    await actions.wizard.onClear();

    // Re-populate w/ household data
    if (payload.household){
      // Populate all key data
      await actions.person.onPopulate();
      await actions.evaluation.onPopulate();

      // Populate interview
      await actions.interview.onPopulate({ type: InterviewDataType.ALL, householdId });

      // Populate objectives
      await actions.objective.onPopulate({ type: IObjectiveDataType.ALL });

      // Load other users
      await actions.user.onPopulateUsers({ householdId });
    }

    // Hide loading
    actions.layout.setLoading(false);

  } catch (err) {
    actions.layout.setLoading(false);
    processServerError('household.onSelect', err);
  }
});

export default onSelect;