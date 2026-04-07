import {action, Action} from 'easy-peasy';
import {IWizardStoreModel} from "~/types/wizard/store";
import {IInterviewUpdatePayload} from "~/ui/constants/interview";
import {isNullOrUndefined} from "~/ui/constants/utils";

const toggleHiddenResponse: Action<IWizardStoreModel, IInterviewUpdatePayload> = action((state: any, payload: IInterviewUpdatePayload) => {
  const wizard = state.wizard;

  if (isNullOrUndefined(payload.parentIndex)) {
    state.wizard.steps[wizard.activeStepIndex]
      .steps[wizard.activeSubStepIndex]
      .questions[payload.questionIndex]
      .Responses[payload.responseIndex]
      .Hidden = payload.hidden;
  } else {
    state.wizard.steps[wizard.activeStepIndex]
      .steps[wizard.activeSubStepIndex]
      .questions[payload.parentIndex]
      .SubQuestions[payload.questionIndex]
      .Responses[payload.responseIndex]
      .Hidden = payload.hidden;
  }

  // Set hidden field if question is currently active
  if (state.activeResponseIndex == payload?.responseIndex) {
    state.activeResponse.Starred = payload.starred;
  }

  // Update steps
  state.activeStep = state.wizard.steps[wizard.activeStepIndex];
  state.activeSubStep = state.wizard.steps[wizard.activeStepIndex].steps[wizard.activeSubStepIndex];

});

export default toggleHiddenResponse;
