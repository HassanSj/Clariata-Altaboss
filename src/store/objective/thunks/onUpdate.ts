import {thunk, Thunk} from 'easy-peasy';
import {IObjectiveDataType, IObjectiveStoreModel, IObjectiveStorePayload} from "~/types/objective/store";
import {AxiosResponse} from "axios";
import api from "~/services/api";
import {processServerError} from "~/services/api/errors";
import {logSimple} from "~/ui/constants/utils";

const onUpdate: Thunk<IObjectiveStoreModel, IObjectiveStorePayload> = thunk(async ({ update }, payload: IObjectiveStorePayload, helpers) => {
  const store: any = helpers.getStoreState();
  const actions: any = helpers.getStoreActions();

  logSimple('Objective.onUpdate', payload);

  // Objectives
  if (IObjectiveDataType.OBJECTIVE === payload?.type && payload?.objectiveId && payload?.objective) {
    try {
      const res: AxiosResponse = await api.objective.update(
        store?.household?.selectedHousehold?.HouseholdID,
        store?.interview?.dreamInterviewId,
        payload?.objectiveId,
        payload?.objective);
      // Update
      update({
        ...payload,
        objective: res.data
      });
    } catch (err) {
      processServerError(err, 'objective.onUpdate');
    }
  }
  // Action items
  if (IObjectiveDataType.ACTION_ITEM === payload?.type && payload?.objectiveId && payload?.actionItemId && payload?.actionItem) {
    logSimple('Objective.onUpdate.execution', payload);
    try {
      const res: AxiosResponse = await api.actionitem.update(
        store?.household?.selectedHousehold?.HouseholdID,
        payload?.objectiveId,
        payload?.actionItemId,
        payload?.actionItem);
      // Update
      update({
        ...payload,
        actionItem: res.data
      });
    } catch (err) {
      logSimple('Objective.onUpdate.error', err);
      processServerError(err, 'objective.onUpdate');
    }
  }
});

export default onUpdate;
