import {action, Action} from 'easy-peasy';
import {IClientEvaluationStoreModel} from "~/types/evaluation/store";

const clear: Action<IClientEvaluationStoreModel> = action((state: any, payload: any) => {
    state.evaluations = [];
    state.selectedEvaluation = null;
});

export default clear;
