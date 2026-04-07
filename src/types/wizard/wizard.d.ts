import {
  WizardLevelType,
  WizardStepCompletionStatus,
  WizardStepStatus,
  WizardStepType,
  WizardStepValidityStatus,
  WizardType
} from "~/ui/constants/wizard";
import {QuestionAndResponse} from "~/types/api/questionAndResponse";
import {Person} from "~/types/api/person";
import {ClientEvaluation} from "~/types/api/clientEvaluation";
import {InterviewFull} from "~/types/api/interviewFull";
import {InterviewCategoryProgress} from "~/types/api/interviewCategoryProgress";
import {DimensionOfLife} from "~/types/api/dimensionOfLife";
import {MetricOfSuccess} from "~/types/api/metricOfSuccess";
import {QuestionCategory} from "~/types/api/questionCategory";
import { ReportType } from "~/ui/constants/reports";

declare interface WizardWorker {
  updateWizardState: <T>(wizard: WizardState) => undefined;
  updateWizardStepState: <T>(wizard: WizardState, source: T) => undefined;
  isQuestionAndResponseComplete: <T>(wizard: WizardState, step: WizardStep, source: T) => undefined;
}

declare interface WizardState {
  toggleExpanded?:boolean;
  singleExpanded?:string|"all" | "single" ;
  type: WizardType;
  title: string;
  totalQuestionsCount?: number;
  totalCompletedQuestionsCount?: number;
  levels: WizardLevelType;
  steps: WizardStep[];
  subSteps: WizardStep[];
  activeStep?: WizardStep;
  activeSubStep?: WizardStep;
  activeStepIndex: number;
  activeSubStepIndex: number;
  totalSteps: number;
  progress: number;
  persons?: Person[];
  personsOptions?: { label: string, value: number}[];
  filtered?: boolean;
  selectedSections?: number[];
  selectedReport?: ReportType;
  hideClarifying?: boolean;

  interview?: InterviewFull;
  evaluation?: ClientEvaluation;
}

declare interface WizardStep {
  id: number;
  index: number;
  type: WizardStepType;
  status: WizardStepStatus;
  completionStatus: WizardStepCompletionStatus;
  validityStatus: WizardStepValidityStatus;
  classes?: any,
  avatarClasses?: any,
  title: string;
  description?: string;
  directions?: string;
  icon?: string;
  color?: string;
  steps?: WizardStep[];
  questions?: QuestionAndResponse[];

  completedQuestionsCount?: number;
  totalQuestionsCount?: number;
  completedStepsCount?: number;
  totalStepsCount?: number;
  percentCompleted?: number;

  dimensionOfLife?: DimensionOfLife;
  metricOfSuccess?: MetricOfSuccess;
  discoveryCategory?: QuestionCategory;
  interviewCategoryProgress?: InterviewCategoryProgress | null | undefined;
}

declare interface WizardResponseSummary {
  items: WizardResponseSummaryItem[];
}

declare interface WizardResponseSummaryItem {
  personId: number;
  person: Person;
  responsesCount: number;
}
