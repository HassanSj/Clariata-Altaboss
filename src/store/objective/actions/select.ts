import {action, Action} from 'easy-peasy';
import {IObjectiveDataType, IObjectiveStoreModel, IObjectiveStorePayload} from "~/types/objective/store";

const select: Action<IObjectiveStoreModel, IObjectiveStorePayload> = action((state: any, payload: IObjectiveStorePayload) => {
  // Objectives
  if (IObjectiveDataType.OBJECTIVE === payload?.type) {
    state.selectedObjective = payload?.objective;
    if(!state.completedPrioritySections)
      state.completedPrioritySections = {}
    state.completedPrioritySections[Number(payload?.objectiveId)] = payload?.completedPrioritySections ?? [];
  }
  // Objective IDs
  if (IObjectiveDataType.OBJECTIVE_IDS === payload?.type) {
    state.selectedObjectiveIds = payload?.objectiveIds;
  }
  // Action items
  if (IObjectiveDataType.ACTION_ITEM === payload?.type) {
    state.selectedActionItem = payload?.actionItem;
  }

  if(IObjectiveDataType.COMPLETED_PRIORITY === payload?.type){
    if(payload?.objectiveId) {
      if(!state.completedPrioritySections)
        state.completedPrioritySections = {}
      state.completedPrioritySections[payload?.objectiveId] = payload?.completedPrioritySections ?? []
    }
  }
});

export default select;
