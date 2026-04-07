import {action, Action} from 'easy-peasy';
import {Objective} from "~/types/api/objective";
import {ActionItem} from "~/types/api/actionItem";
import {IObjectiveDataType, IObjectiveStoreModel, IObjectiveStorePayload} from "~/types/objective/store";
import {logSimple} from "~/ui/constants/utils";

const update: Action<IObjectiveStoreModel, IObjectiveStorePayload> = action((state: any, payload: IObjectiveStorePayload) => {
  logSimple('objective.update', payload);

  // Objectives
  if (IObjectiveDataType.OBJECTIVE === payload?.type) {
    if (!payload.objective) return;
    // Create objectives array if it doesn't exist
    if (!state.objectives) {
      state.objectives = [];
    }
    // Check if it already exists
    const index = state.objectives.findIndex((p: Objective) => p.ObjectiveID === payload.objective?.ObjectiveID);
    if (index >= 0){
      // Replace existing
      state.objectives[index] = payload.objective;
    } else {
      // Add new
      state.objectives.push(payload.objective);
    }
    if (state.selectedObjective?.ObjectiveID === payload.objective?.ObjectiveID) {
      state.selectedObjective = payload.objective;
      logSimple('objective.update.selectedObjective', payload.objective);
    }

    // Update selected objective
    if (state.selectedObjective?.ObjectiveID === payload.objective?.ObjectiveID) {
      state.selectedObjective = payload.objective;
    }
  }

  // Action items
  if (IObjectiveDataType.ACTION_ITEM === payload?.type) {
    if (!payload.actionItem) return;
    if (!state.actionItems) {
      state.actionItems = [];
    }

    // Update parent if it's a child
    if (payload?.actionItem?.ParentActionItem) {
      // Check if it already exists
      const index = state.actionItems.findIndex((p: ActionItem) => p.ActionItemID === payload.actionItem?.ParentActionItemID);
      if (index >= 0){
        // Replace existing
        state.actionItems[index] = payload.actionItem?.ParentActionItem;
      } else {
        // Add new
        state.actionItems.push(payload.actionItem);
      }
    }
    // Otherwise, handle as highest level action item
    else {
      // Check if it already exists
      const index = state.actionItems.findIndex((p: ActionItem) => p.ActionItemID === payload.actionItem?.ActionItemID);
      if (index >= 0){
        state.actionItems[index] = payload.actionItem;
      } else {
        // Add new
        state.actionItems.push(payload.actionItem);
      }
    }

    // Update selected action item
    if (IObjectiveDataType.ACTION_ITEM === payload?.type) {
      if (state.selectedActionItem?.ActionItemID === payload.actionItem?.ActionItemID) {
        state.selectedActionItem = payload.actionItem;
      }
      else if (state.selectedActionItem?.ParentActionItemID === payload.actionItem?.ParentActionItemID) {
        state.selectedActionItem = payload.actionItem?.ParentActionItem;
      }
    }
  }


});

export default update;
