import {action, Action} from 'easy-peasy';
import {isNullOrUndefined} from "~/ui/constants/utils";
import {IWizardStoreModel} from "~/types/wizard/store";
import {IInterviewUpdatePayload} from "~/ui/constants/interview";


const updateResponse: Action<IWizardStoreModel, IInterviewUpdatePayload> = action((state: any, payload: IInterviewUpdatePayload) => {
  const wizard = state.wizard;

  // Update question w/ responses
  const newQuestion = Object.assign({}, payload.question);
  if (isNullOrUndefined(payload.parentIndex)) {
    state.wizard.steps[wizard.activeStepIndex]
      .steps[wizard.activeSubStepIndex]
      .questions[payload.questionIndex] = payload.question;
  } else {
    state.wizard.steps[wizard.activeStepIndex]
      .steps[wizard.activeSubStepIndex]
      .questions[payload.parentIndex]
      .SubQuestions[payload.questionIndex] = payload.question;
  }

  // Update wizard
  // TODO: probably need to re-enable this, but needs to be optimized
  // const updatedWizard = updateWizardState(state.wizard, payload.interview);
  // state.wizard = Object.assign(state.wizard, updatedWizard);

  // Update steps
  state.activeStep = state.wizard.steps[wizard.activeStepIndex];
  state.activeSubStep = state.wizard.steps[wizard.activeStepIndex].steps[wizard.activeSubStepIndex];

});

export default updateResponse;
