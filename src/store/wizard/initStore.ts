import {DEFAULT_WIZARD_STATE, DEFAULT_WIZARD_STEP} from "~/ui/constants/wizard";
import {WizardState, WizardStep} from "~/types/wizard/wizard";

interface InitStore {
  wizard?: WizardState;
  toggleExpanded?:boolean;
  activeStep?: WizardStep;
  activeSubStep?: WizardStep;
  showStarredQuestionsOnly?: boolean;
  showStarredResponsesOnly?: boolean;
  showResponseForm?: boolean;
}

const initStore: InitStore = {
  wizard: DEFAULT_WIZARD_STATE,
  activeStep: DEFAULT_WIZARD_STEP,
  activeSubStep: DEFAULT_WIZARD_STEP,
  showStarredQuestionsOnly: false,
  showStarredResponsesOnly: false,
  showResponseForm: true,
  toggleExpanded:false
};

export default initStore;
