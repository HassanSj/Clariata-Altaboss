import {thunk, Thunk} from 'easy-peasy';

import {ClientEvaluation} from 'types/api/clientEvaluation';
import {IClientEvaluationStoreModel} from "~/types/evaluation/store";
import {processServerError} from "~/services/api/errors";
import paths from "~/ui/constants/paths";
import {NextRouter} from "next/router";
import {toEvaluationWizard} from "~/services/evaluation";

const { EVALUATION } = paths;

interface IPayload {
  evaluation: ClientEvaluation;
  router: NextRouter;
}

const onSelect: Thunk<IClientEvaluationStoreModel, IPayload> = thunk(async ({ select }, payload: IPayload, helpers) => {
  const store: any = helpers.getStoreState();
  const actions: any = helpers.getStoreActions();
  const { evaluation, router } = payload;
  try {

    // Dispatch select action
    select(evaluation);

    // Populate wizard details
    actions.wizard.onPopulate(toEvaluationWizard(
      store.constants.complexityOfNeeds,
      store.constants.legacyInterest,
      evaluation));

  } catch (err) {
    processServerError('household.onSelect', err);
  }
});

export default onSelect;
