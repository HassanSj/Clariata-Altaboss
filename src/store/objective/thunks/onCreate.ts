import {thunk, Thunk} from 'easy-peasy';
import {IObjectiveDataType, IObjectiveStoreModel, IObjectiveStorePayload} from "~/types/objective/store";
import {AxiosResponse} from "axios";
import api from "~/services/api";
import {processServerError} from "~/services/api/errors";

const onCreate: Thunk<IObjectiveStoreModel, IObjectiveStorePayload> = thunk(async ({ update }, payload: IObjectiveStorePayload, helpers) => {
  const store: any = helpers.getStoreState();
  const actions: any = helpers.getStoreActions();
  // Objectives
  if (IObjectiveDataType.OBJECTIVE === payload?.type && payload?.objectiveId && payload?.objective) {
    try {
      const res: AxiosResponse = await api.objective.create(
        store?.household?.selectedHousehold?.HouseholdID,
        store?.interview?.dreamInterviewId,
        payload?.objective);
      // Update
      update({
        ...payload,
        objective: res.data
      });
    } catch (err) {
      processServerError(err, 'evaluation.onCreate');
    }
  }
  // Action items
  if (IObjectiveDataType.ACTION_ITEM === payload?.type && payload?.objectiveId && payload?.actionItemId && payload?.actionItem) {
    try {
      const res: AxiosResponse = await api.actionitem.create(
        store?.household?.selectedHousehold?.HouseholdID,
        payload?.objectiveId,
        payload?.actionItem);
      // Update
      update({
        ...payload,
        actionItem: res.data
      });
    } catch (err) {
      processServerError(err, 'evaluation.onCreate');
    }
  }
});

export default onCreate;
