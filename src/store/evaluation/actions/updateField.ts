import {action, Action} from 'easy-peasy';
import {IClientEvaluationStoreModel} from "~/types/evaluation/store";

interface IPayload {
  field: string;
  value: any;
}

const updateField: Action<IClientEvaluationStoreModel, IPayload> = action((state: any, payload: IPayload) => {
  state.selectedEvaluation[payload.field] = payload.value;
});

export default updateField;
