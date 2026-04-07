import {thunk, Thunk} from 'easy-peasy';
import {AxiosResponse} from 'axios';
import api from 'services/api';

import {processServerError} from 'services/api/errors';
import {ClientEvaluation} from "~/types/api/clientEvaluation";
import {IClientEvaluationStoreModel} from "~/types/evaluation/store";

interface IPayload {
  evaluationID: number;
  evaluation: ClientEvaluation
}

const onRemove: Thunk<IClientEvaluationStoreModel, IPayload> = thunk(async ({ populate }, { evaluationID, evaluation }: IPayload) => {

  try {
    // Delete the evaluation
    const removeResponse: AxiosResponse = await api.evaluation.remove(evaluationID, evaluation);
    // Repopulate list of evaluations
    const listResponse: AxiosResponse = await api.evaluation.list();
    populate(listResponse.data);
  } catch (err) {
    processServerError(err, 'evaluation.onRemove');
  }
});

export default onRemove;
