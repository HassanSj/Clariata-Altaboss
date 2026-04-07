import {thunk, Thunk} from 'easy-peasy';
import {IObjectiveDataType, IObjectiveStoreModel, IObjectiveStorePayload} from "~/types/objective/store";
import api from "~/services/api";
import {processServerError} from "~/services/api/errors";
import {ActionItem} from "~/types/api/actionItem";
import {Objective} from "~/types/api/objective";

const onRefresh: Thunk<IObjectiveStoreModel, IObjectiveStorePayload> = thunk(async ({ update }, payload: IObjectiveStorePayload, helpers) => {

  let result = null;
  const store: any = helpers.getStoreState();

  const objectiveId = (IObjectiveDataType.OBJECTIVE === payload?.type)
    ? payload?.objectiveId
    : payload?.actionItem?.ObjectiveID;

  // Objectives
  if ((IObjectiveDataType.OBJECTIVE === payload?.type && objectiveId)
    || IObjectiveDataType.ACTION_ITEM === payload?.type && objectiveId) {
    try {
      const res: Objective = await api.objective.getFull(
        store?.household?.selectedHousehold?.HouseholdID,
        store?.interview?.dreamInterviewId,
        objectiveId,
        store.constants.dimensionsOfLife,
        store.constants.metricsOfSuccess);

      // Update store
      update({
        ...payload,
        type: IObjectiveDataType.OBJECTIVE,
        objective: res
      });
      // Set result
      result = res;
    } catch (err) {
      processServerError(err, 'objective.onRefresh');
    }
  }

  // Action items
  if (IObjectiveDataType.ACTION_ITEM === payload?.type && payload?.objectiveId && payload?.actionItemId) {
    try {
      const res: ActionItem = await api.actionitem.getFull(
        store?.household?.selectedHousehold?.HouseholdID,
        payload?.objectiveId,
        store?.interview?.dreamInterviewId,
        payload?.actionItemId);
      // Update store
      update({
        ...payload,
        actionItem: res
      });
      // Set result
      result = res;
    } catch (err) {
      processServerError(err, 'objective.onRefresh');
    }
  }

  return result;
});

export default onRefresh;
