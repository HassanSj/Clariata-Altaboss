import {action, Action} from 'easy-peasy';
import {IWizardStoreModel} from "~/types/wizard/store";

const clear: Action<IWizardStoreModel> = action((state: any) => {
  state.wizard = null;
  state.activeStep = null;
  state.activeStepIndex = 0;
  state.activeSubStep = null;
  state.activeSubStepIndex = 0;
  state.activeQuestionIndex = 0;
  state.activeQuestionId = null;
  state.activeParentQuestionIndex = null;
  state.activeParentQuestionId = null;
  state.activeResponse = null;
  state.activeResponseId = null;
  state.activeResponseIndex = null;
});

export default clear;
