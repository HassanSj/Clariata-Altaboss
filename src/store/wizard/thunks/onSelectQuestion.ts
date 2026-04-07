import {thunk, Thunk} from 'easy-peasy';
import {processServerError} from 'services/api/errors';
import {IWizardStoreModel} from "~/types/wizard/store";
import {QuestionAndResponse} from "~/types/api/questionAndResponse";

interface IPayload {
  index?: number;
  parentIndex?: number;
  question?: QuestionAndResponse
}

const onSelectQuestion: Thunk<IWizardStoreModel, IPayload> = thunk(async ({ selectQuestion }, payload: IPayload) => {
  try {
    selectQuestion(payload);
  } catch (err) {
    processServerError(err, 'wizard.onSelectQuestion');
  }
});

export default onSelectQuestion;
