import {action, Action} from 'easy-peasy';
import {IClientEvaluationStoreModel} from "~/types/evaluation/store";
import {ClientEvaluation} from "~/types/api/clientEvaluation";

const populate: Action<IClientEvaluationStoreModel, ClientEvaluation[]> = action((state: any, payload: ClientEvaluation[]) => {
  state.evaluations = payload;
});

export default populate;
