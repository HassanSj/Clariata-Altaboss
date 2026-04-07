import {action, Action} from 'easy-peasy';
import {IObjectiveDataType, IObjectiveStoreModel} from "~/types/objective/store";

const clear: Action<IObjectiveStoreModel> = action((state: any, payload: any) => {
  const isAll = (IObjectiveDataType.ALL === payload?.type);
  // Objectives
  if (IObjectiveDataType.OBJECTIVE === payload?.type || isAll) {
    state.selectedObjective = null;
    state.objectives = null;
  }
  // Action items
  if (IObjectiveDataType.ACTION_ITEM === payload?.type || isAll) {
    state.selectedActionItem = null;
    state.actionItems = null;
  }
});

export default clear;
