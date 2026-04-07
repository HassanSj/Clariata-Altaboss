import {action, Action} from 'easy-peasy';
import {WizardDataType} from "~/ui/constants/wizard";
import {IWizardStoreModel} from "~/types/wizard/store";
import {WizardStep} from "~/types/wizard/wizard";
import {QuestionAndResponse} from "~/types/api/questionAndResponse";
import {InterviewResponse} from "~/types/api/interviewResponse";
import {isNullOrUndefined} from "~/ui/constants/utils";

interface IPayload {
  type: WizardDataType,
  step?: WizardStep,
  question?: QuestionAndResponse,
  response?: InterviewResponse,
  responseIndex?: number,
  showResponseForm?: boolean,
  subStepIndex?: boolean,
}

const select: Action<IWizardStoreModel, IPayload> = action((state: any, payload: IPayload) => {
  if (payload?.type === WizardDataType.STEP) {
    state.activeStepIndex = payload?.step?.index;
    state.activeStep = payload?.step;
    state.wizard.activeStepIndex = state.activeStepIndex;
  }
  if (payload?.type === WizardDataType.SUBSTEPINDEX) {
    state.activeSubStepIndex = payload?.subStepIndex;
  }
  if (payload?.type === WizardDataType.SUB_STEP) {
    state.activeSubStepIndex = payload?.step?.index;
    state.activeSubStep = payload?.step;
    state.wizard.activeSubStepIndex = state.activeSubStepIndex;
  }
  if (payload?.type === WizardDataType.QUESTION) {
    state.activeQuestionIndex = payload?.question?.index;
    state.activeQuestion = payload?.question;
    state.activeQuestionId = payload?.question?.Question?.QuestionID;
    state.wizard.activeQuestionIndex = state.activeQuestionIndex;
  }
  if (payload?.type === WizardDataType.RESPONSE) {
    state.activeQuestionIndex = payload?.question?.index;
    state.activeQuestion = payload?.question;
    state.activeQuestionId = payload?.question?.Question?.QuestionID;
    state.wizard.activeQuestionIndex = state.activeQuestionIndex;
    state.activeResponse = payload?.response;
    state.activeResponseId = payload?.response?.InterviewResponseID;
    state.activeResponseIndex = payload?.responseIndex;
    if (!isNullOrUndefined(payload?.showResponseForm)) {
      state.showResponseForm = payload?.showResponseForm;
    } else {
      state.showResponseForm = true;
    }

  }
});

export default select;
