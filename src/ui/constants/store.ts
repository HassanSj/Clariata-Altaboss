import {Action, Thunk} from 'easy-peasy';
import {PersonalRelationshipType} from "~/types/api/personalRelationshipType";
import {PhoneNumberType} from "~/types/api/phoneNumberType";
import {SharedItemType} from "~/types/api/sharedItemType";
import {ShareType} from "~/types/api/shareType";
import {ActionItemStatus} from "~/types/api/actionItemStatus";
import {ComplexityOfNeed} from "~/types/api/complexityOfNeed";
import {CoreValue} from "~/types/api/coreValue";
import {DimensionOfLife} from "~/types/api/dimensionOfLife";
import {InterviewTemplate} from "~/types/api/interviewTemplate";
import {LegacyInterest} from "~/types/api/legacyInterest";
import {MaritalStatus} from "~/types/api/maritalStatus";
import {MetricOfSuccess} from "~/types/api/metricOfSuccess";
import {MilestoneUpdateStatus} from "~/types/api/milestoneUpdateStatus";
import {QuestionCategory} from "~/types/api/questionCategory";
import {ObjectiveType} from "~/types/api/objectiveType";
import {Timeframe} from "~/types/api/timeframe";
import {ActionItemType} from "~/types/api/actionItemType";
import {IntervalType} from "~/types/api/intervalType";
import {Timezone} from "~/types/api/timezone";

export interface IConstantTypesStoreModel {
  phoneNumberTypes: PhoneNumberType[];
  maritalStatuses: MaritalStatus[];
  coreValues: CoreValue[];
  dimensionsOfLife: DimensionOfLife[];
  discoverCategories: QuestionCategory[];
  metricsOfSuccess: MetricOfSuccess[];
  complexityOfNeeds: ComplexityOfNeed[];
  legacyInterest: LegacyInterest[];
  personalRelationshipTypes: PersonalRelationshipType[];
  itemType: SharedItemType[];
  shareType: ShareType[];
  objectiveTypes: ObjectiveType[];
  actionItemStatuses?: ActionItemStatus[];
  actionItemTypes?: ActionItemType[];
  interviewTemplates?: InterviewTemplate[];
  milestoneUpdateStatuses?: MilestoneUpdateStatus[];
  questionGroups: IInterviewQuestionGroup[];
  timeframes: Timeframe[];
  intervalTypes: IntervalType[];
  timezones: Timezone[];
  populate: Action<IConstantTypesStoreModel, unknown>;
  onPopulate: Thunk<IConstantTypesStoreModel, unknown>;
}

export interface IInterviewQuestionGroup {
  dimensionOfLife: DimensionOfLife;
  metricOfSuccess: MetricOfSuccess;
}
