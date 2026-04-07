import {action, Action} from 'easy-peasy';
import {isNullOrUndefined} from "~/ui/constants/utils";
import {IWizardStoreModel} from "~/types/wizard/store";
import {IInterviewUpdatePayload} from "~/ui/constants/interview";


const removeResponse: Action<IWizardStoreModel, IInterviewUpdatePayload> = action((state: any, payload: IInterviewUpdatePayload) => {
  const wizard = state.wizard;

  // Check required payload fields
  if (!payload.questionId || !payload.responseIndex) {
    return;
  }

  // Remove response from question
  if (isNullOrUndefined(payload.parentIndex)) {
    state.wizard.steps[wizard.activeStepIndex]
      .steps[wizard.activeSubStepIndex]
      .questions[payload.questionIndex]
      .Responses.splice(0, payload.responseIndex);
  } else {
    state.wizard.steps[wizard.activeStepIndex]
      .steps[wizard.activeSubStepIndex]
      .questions[payload.parentIndex]
      .SubQuestions[payload.questionIndex]
      .Responses.splice(0, payload.responseIndex);
  }

  // Reset active response if it's the one being removed
  if ((state.activeQuestionId !== payload?.questionId)
    || (state.activeResponseIndex !== payload?.responseIndex)) {
    state.activeResponse = null;
    state.activeResponseIndex = null;
    state.activeResponseId = null;
  }

  // Update steps
  state.activeStep = state.wizard.steps[wizard.activeStepIndex];
  state.activeSubStep = state.wizard.steps[wizard.activeStepIndex].steps[wizard.activeSubStepIndex];

});

export default removeResponse;
