import {action, Action} from 'easy-peasy';
import {IObjectiveDataType, IObjectiveStoreModel, IObjectiveStorePayload} from "~/types/objective/store";
import {sortBy} from 'lodash';
import {hasItems} from "~/ui/constants/utils";

const populate: Action<IObjectiveStoreModel, IObjectiveStorePayload> = action((state: any, payload: IObjectiveStorePayload) => {
  // Objectives
  if (IObjectiveDataType.OBJECTIVE === payload?.type) {
    state.objectives = hasItems(payload?.objectives) ? sortBy(payload?.objectives, 'Rank') : payload?.objectives;
    state.selectedObjectiveIds = payload?.objectiveIds ? payload.objectiveIds : state.selectedObjectiveIds;
  }
  // Action items
  if (IObjectiveDataType.ACTION_ITEM === payload?.type) {
    state.actionItems = payload?.actionItems;
  }
});

export default populate;
