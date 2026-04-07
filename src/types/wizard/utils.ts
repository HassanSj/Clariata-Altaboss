import {QuestionCategory} from "~/types/api/questionCategory";
import {WizardState, WizardStep} from "~/types/wizard/wizard";
import {
  DEFAULT_WIZARD_STATE,
  DEFAULT_WIZARD_STEP,
  WizardStepCompletionStatus,
  WizardStepStatus,
  WizardStepValidityStatus
} from "~/ui/constants/wizard";
import styles from "~/ui/components/Wizard/Wizard/Wizard.module.scss";


export const getStepById = (id: number, steps: WizardStep[]) => {
  return steps.find(item => item.id === id);
}

export const getStepByIndex = (index: number, steps: WizardStep[]) => {
  return steps.find(item => item.index === index);
}

export const getStepContent = (state: WizardState) => {
  if (!state?.subSteps) {
    return;
  }
  const step = state?.subSteps.find(item => item.index === state?.activeSubStepIndex);
  return step?.title;
}

export const getWizard = (discoverCategories: QuestionCategory[]) => {
  let result = Object.assign({}, DEFAULT_WIZARD_STATE);

  // Populate steps
  result.steps = generateMainSteps();
  result.subSteps = generateCategorySteps(discoverCategories);

  // Additional enhancements
  result = updateState(result);

  return result;
}

export const generateMainSteps = (): WizardStep[] => {
  const result: WizardStep[] = [];
  result.push({
    ...DEFAULT_WIZARD_STEP,
    id: 0,
    index: 0,
    title: 'Discover',
  });
  result.push({
    ...DEFAULT_WIZARD_STEP,
    id: 0,
    index: 0,
    title: 'Dream',
  });
  result.push({
    ...DEFAULT_WIZARD_STEP,
    id: 0,
    index: 0,
    title: 'Direction',
  });
  return result;
}

export const generateCategorySteps = (categories: QuestionCategory[]): WizardStep[] => {
  let index = -1;
  const steps = new Array();

  /*
  const steps = categories.map((item: QuestionCategory) => {
    index++;
    return {
      ...DEFAULT_WIZARD_STEP,
      id: item.DimensionOfLifeID,
      index,
      title: item.DimensionOfLife,
      questions: new Array()
    };
  });

   */

  steps.push({
    ...DEFAULT_WIZARD_STEP,
    id: 0,
    index: 0,
    title: 'Active',
    questions: new Array(),
    status: WizardStepStatus.ACTIVE
  });

  steps.push({
    ...DEFAULT_WIZARD_STEP,
    id: 0,
    index: 0,
    title: 'Valid',
    questions: new Array(),
    validityStatus: WizardStepValidityStatus.VALID
  });

  steps.push({
    ...DEFAULT_WIZARD_STEP,
    id: 0,
    index: 0,
    title: 'Invalid',
    questions: new Array(),
    validityStatus: WizardStepValidityStatus.INVALID
  });

  steps.push({
    ...DEFAULT_WIZARD_STEP,
    id: 0,
    index: 0,
    title: 'In progress',
    questions: new Array(),
    completionStatus: WizardStepCompletionStatus.IN_PROGRESS
  });

  steps.push({
    ...DEFAULT_WIZARD_STEP,
    id: 0,
    index: 0,
    title: 'Completed',
    questions: new Array(),
    completionStatus: WizardStepCompletionStatus.COMPLETED
  });

  return steps;
}

export const updateState = (wizard: WizardState): WizardState => {
  wizard.steps = updateStepState(wizard.steps);
  wizard.subSteps = updateStepState(wizard.subSteps);

  return wizard;
}

export const updateStepState = (steps: WizardStep[]): WizardStep[] => {

  if (steps){
    let index = 0;
    steps.forEach((step: WizardStep) => {
      step.index = index;
      // Set statuses

      // Set classes
      step.classes = {
        [styles.wizard_nav_step]: true,
        [styles.wizard_nav_step_active]: (step.status === WizardStepStatus.ACTIVE),
        [styles.wizard_nav_step_invalid]: (step.validityStatus === WizardStepValidityStatus.INVALID),
        [styles.wizard_nav_step_inprogress]: (step.completionStatus === WizardStepCompletionStatus.IN_PROGRESS),
        [styles.wizard_nav_step_completed]: (step.completionStatus === WizardStepCompletionStatus.COMPLETED),
      };
      step.avatarClasses = {
        [styles.wizard_nav_step_active_avatar]: (step.status === WizardStepStatus.ACTIVE),
        [styles.wizard_nav_step_invalid_avatar]: (step.validityStatus === WizardStepValidityStatus.INVALID),
        [styles.wizard_nav_step_inprogress_avatar]: (step.completionStatus === WizardStepCompletionStatus.IN_PROGRESS),
        [styles.wizard_nav_step_completed_avatar]: (step.completionStatus === WizardStepCompletionStatus.COMPLETED),
      }
      index++;
    })
  }

  return steps;
}

/**
 * Parse response type.
 * @param type
 */
export const fromResponseType = (type: number) => {
  if (type === 1) {
    return 'boolean';
  } else if (type === 2) {
    return 'number';
  } else if (type === 3) {
    return 'text';
  }

  return 'text';
}
