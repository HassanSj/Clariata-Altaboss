import {action, Action} from 'easy-peasy';
import {IObjectiveDataType, IObjectiveStoreModel, IObjectiveStorePayload} from "~/types/objective/store";

const create: Action<IObjectiveStoreModel, IObjectiveStorePayload> = action((state: any, payload: IObjectiveStorePayload) => {
  // Objectives
  if (IObjectiveDataType.OBJECTIVE === payload?.type) {
    if (!payload.objective) return;
    if (!state.objectives) {
      state.objectives = [];
    }
    state.objectives.push(payload.objective);
  }
  // Action items
  if (IObjectiveDataType.ACTION_ITEM === payload?.type) {
    if (!payload.actionItem) return;
    if (!state.actionItems) {
      state.actionItems = [];
    }
    state.actionItems.push(payload.actionItem);
  }
});

export default create;
