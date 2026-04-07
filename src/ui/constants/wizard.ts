import {WizardState, WizardStep} from "~/types/wizard/wizard";
import {QuestionAndResponse} from "~/types/api/questionAndResponse";
import {Question} from "~/types/api/question";
import {FormInputType} from "~/ui/constants/forms";

export enum WizardViewType {
  WIZARD = 'wizard',
  GRID = 'grid'
}

export enum WizardType {
  NONE,
  EVALUATION,
  DREAM_INTERVIEW,
  DISCOVER_INTERVIEW
}

export enum WizardLevelType {
  HORIZONTAL,
  VERTICAL,
  BOTH
}

export enum WizardDataType {
  STEP,
  SUB_STEP,
  QUESTION,
  RESPONSE,
  SUBSTEPINDEX
}

export enum WizardStepType {
  STEP,
  SUB_STEP
}

export enum WizardStepStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive'
}

export enum WizardStepCompletionStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed'
}

export enum WizardStepValidityStatus {
  NOT_CHECKED = 'not_checked',
  VALID = 'pending',
  INVALID = 'in_progress'
}

export const DEFAULT_WIZARD_STATE: WizardState = {
  type: WizardType.NONE,
  title: "Default Wizard",
  levels: WizardLevelType.VERTICAL,
  steps: [],
  subSteps: [],
  activeStepIndex: 0,
  activeSubStepIndex: 0,
  totalSteps: 0,
  progress: 0,
}

export const DEFAULT_WIZARD_STEP: WizardStep = {
  id: 0,
  index: 0,
  type: WizardStepType.STEP,
  status: WizardStepStatus.INACTIVE,
  completionStatus: WizardStepCompletionStatus.PENDING,
  validityStatus: WizardStepValidityStatus.NOT_CHECKED,
  title: 'Example Title',
  questions: new Array()
}

export const DEFAULT_WIZARD_QUESTION: Question = {
  QuestionID: 0,
  ResponseTypeID: 0,
  QuestionName: 'Example Name',
  QuestionText: 'Example Text',
  InputName: 'ExampleName',
  InputType: FormInputType.TEXT
}

export const DEFAULT_WIZARD_QUESTION_AND_RESPONSE: QuestionAndResponse = {
  Question: {
    ...DEFAULT_WIZARD_QUESTION
  },
  Responses: []
}


