import {thunk, Thunk} from 'easy-peasy';
import {processServerError} from 'services/api/errors';
import {IWizardStoreModel} from "~/types/wizard/store";
import {WizardDataType} from "~/ui/constants/wizard";
import {WizardStep} from "~/types/wizard/wizard";
import {QuestionAndResponse} from "~/types/api/questionAndResponse";
import {InterviewResponse} from "~/types/api/interviewResponse";

interface IPayload {
  type: WizardDataType,
  step?: WizardStep,
  question?: QuestionAndResponse,
  response?: InterviewResponse,
  responseIndex?: number,
  showResponseForm?: boolean
}

const onSelect: Thunk<IWizardStoreModel, IPayload> = thunk(async ({ select }, payload: IPayload) => {
  try {
    select(payload);
  } catch (err) {
    processServerError(err, 'wizard.onPopulate');
  }
});

export default onSelect;
