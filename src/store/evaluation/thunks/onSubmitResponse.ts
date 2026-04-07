import {thunk, Thunk} from 'easy-peasy';
import {IClientEvaluationStoreModel} from "~/types/evaluation/store";
import {processServerError} from "~/services/api/errors";
import api from "~/services/api";
import {IPatchUpdate} from "~/types/api";
import {ApiPatchType} from "~/ui/constants/api";

interface IPayload {
  evaluationId: number;
  field: string;
  value: any;
}

const onSubmitResponse: Thunk<IClientEvaluationStoreModel, IPayload> = thunk(async ({ select }, payload: IPayload) => {
  try {
    // Perform update
    const update: IPatchUpdate = {
      op: ApiPatchType.REPLACE,
      path: `/${payload.field}`,
      value: payload.value
    };
    const res = await api.evaluation.patch(payload.evaluationId, [update]);
    // Update evaluation
    select(res.data);
  } catch (err) {
    processServerError('household.onSelect', err);
  }
});

export default onSubmitResponse;
