import {Action, Thunk} from 'easy-peasy';
import {Objective} from "~/types/api/objective";
import {ActionItem} from "~/types/api/actionItem";

export interface IObjectiveStoreModel {
  selectedObjective: Objective;
  selectedObjectiveIds: { [key: string]: boolean };
  completedPrioritySections: { [key: string]: { [key: string]: boolean }};
  objectives: Objective[];
  selectedActionItem: ActionItem;
  actionItems: ActionItem[];
  onSelect: Thunk<IObjectiveStoreModel, unknown>;
  select: Action<IObjectiveStoreModel, unknown>;
  onPopulate: Thunk<IObjectiveStoreModel, unknown>;
  populate: Action<IObjectiveStoreModel, unknown>;
  onUpdate: Thunk<IObjectiveStoreModel, unknown>;
  update: Action<IObjectiveStoreModel, unknown>;
  onClear: Thunk<IObjectiveStoreModel, unknown>;
  clear: Action<IObjectiveStoreModel, unknown>;
  onRemove: Thunk<IObjectiveStoreModel, unknown>;
  create: Action<IObjectiveStoreModel, unknown>;
  onCreate: Thunk<IObjectiveStoreModel, unknown>;
  onReplace: Thunk<IObjectiveStoreModel, unknown>;
  onRankUpdate: Thunk<IObjectiveStoreModel, unknown>;
  onRefresh: Thunk<IObjectiveStoreModel, unknown>;
}

export enum IObjectiveDataType {
  ALL,
  OBJECTIVE,
  OBJECTIVE_IDS,
  ACTION_ITEM,
  COMPLETED_PRIORITY
}

export interface IObjectiveStorePayload {
  type?: IObjectiveDataType;
  objectiveId?: number;
  objective?: Objective;
  objectives?: Objective[];
  objectiveIds?: { [key: string]: boolean };
  actionItemId?: number;
  actionItem?: ActionItem;
  actionItems?: ActionItem[];
  force?: boolean;
  completedPrioritySections?: { [key: string]: boolean };
  selected?: boolean;
}
