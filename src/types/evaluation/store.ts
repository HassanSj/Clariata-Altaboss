import {Action, Thunk} from 'easy-peasy';
import {ClientEvaluation} from "~/types/api/clientEvaluation";

export interface IClientEvaluationStoreModel {
  selectedEvaluation: ClientEvaluation;
  evaluations: ClientEvaluation[];
  select: Action<IClientEvaluationStoreModel, unknown>;
  populate: Action<IClientEvaluationStoreModel, unknown>;
  clear: Action<IClientEvaluationStoreModel, unknown>;
  updateField: Action<IClientEvaluationStoreModel, unknown>;
  onSelect: Thunk<IClientEvaluationStoreModel, unknown>;
  onPopulate: Thunk<IClientEvaluationStoreModel, unknown>;
  onRemove: Thunk<IClientEvaluationStoreModel, unknown>;
  onClear: Thunk<IClientEvaluationStoreModel, unknown>;
  onSubmitResponse: Thunk<IClientEvaluationStoreModel, unknown>;
}
