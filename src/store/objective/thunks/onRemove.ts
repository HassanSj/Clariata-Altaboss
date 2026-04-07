import {thunk, Thunk} from 'easy-peasy';
import {AxiosResponse} from 'axios';
import api from 'services/api';

import {processServerError} from 'services/api/errors';
import {IObjectiveDataType, IObjectiveStoreModel, IObjectiveStorePayload} from "~/types/objective/store";

const onRemove: Thunk<IObjectiveStoreModel, IObjectiveStorePayload> = thunk(async ({ populate }, payload: IObjectiveStorePayload, helpers) => {
  const store: any = helpers.getStoreState();
  const actions: any = helpers.getStoreActions();
  // Objectives
  if (IObjectiveDataType.OBJECTIVE === payload?.type && payload?.objectiveId && payload?.objective) {
    try {
      const res: AxiosResponse = await api.objective.remove(
        store?.household?.selectedHousehold?.HouseholdID,
        store?.interview?.dreamInterviewId,
        payload?.objectiveId,
        payload?.objective);
      // Re-populate
      actions.objective.onPopulate({
        type: IObjectiveDataType.OBJECTIVE
      });
    } catch (err) {
      processServerError(err, 'evaluation.onRemove');
    }
  }
  // Action items
  if (IObjectiveDataType.ACTION_ITEM === payload?.type && payload?.actionItemId && payload?.actionItem) {
    try {
      const res: AxiosResponse = await api.actionitem.remove(
        store?.household?.selectedHousehold?.HouseholdID,
        payload?.actionItem?.ObjectiveID,
        payload?.actionItemId,
        payload?.actionItem);
      // Re-populate
      // TODO: Repopulate only affected data
      await actions.objective.onPopulate({
        type: IObjectiveDataType.OBJECTIVE
      });
      await actions.objective.onPopulate({
        type: IObjectiveDataType.ACTION_ITEM
      });
    } catch (err) {
      processServerError(err, 'evaluation.onRemove');
    }
  }
});

export default onRemove;
