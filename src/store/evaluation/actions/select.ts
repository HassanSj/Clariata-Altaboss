import {action, Action} from 'easy-peasy';
import {ClientEvaluation} from 'types/api/clientEvaluation';
import {IClientEvaluationStoreModel} from "~/types/evaluation/store";

const select: Action<IClientEvaluationStoreModel, ClientEvaluation> = action((state: any, payload: ClientEvaluation) => {
  state.selectedEvaluation = payload;
});

export default select;
