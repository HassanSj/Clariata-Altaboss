import {thunk, Thunk} from 'easy-peasy';
import {AxiosResponse} from 'axios';
import api from 'services/api';

import {processServerError} from 'services/api/errors';
import {IClientEvaluationStoreModel} from "~/types/evaluation/store";
import {ClientEvaluation} from "~/types/api/clientEvaluation";
import {Household} from "~/types/api/household";

const onPopulate: Thunk<IClientEvaluationStoreModel, null> = thunk(async ({ populate }, payload, helpers) => {
  const store: any = helpers.getStoreState();
  try {
    const res: AxiosResponse = await api.evaluation.list();
    // Populate household
    if (res.data && store.household.households) {
      res.data.forEach((e: ClientEvaluation) => {
        e.Household = store.household.households.find((h: Household) => h.HouseholdID === e.HouseholdID);
      });
    }
    populate(res.data);
  } catch (err) {
    processServerError(err, 'household.onPopulate');
  }
});

export default onPopulate;
