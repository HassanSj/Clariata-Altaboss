import {PhoneNumberType} from "~/types/api/phoneNumberType";
import {MaritalStatus} from "~/types/api/maritalStatus";
import {CoreValue} from "~/types/api/coreValue";
import {DimensionOfLife} from "~/types/api/dimensionOfLife";
import {MetricOfSuccess} from "~/types/api/metricOfSuccess";
import {ComplexityOfNeed} from "~/types/api/complexityOfNeed";
import {LegacyInterest} from "~/types/api/legacyInterest";
import {PersonalRelationshipType} from "~/types/api/personalRelationshipType";
import {SharedItemType} from "~/types/api/sharedItemType";
import {ShareType} from "~/types/api/shareType";
import {QuestionCategory} from "~/types/api/questionCategory";
import {Timeframe} from "~/types/api/timeframe";

interface InitStore {
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
  timeframes: Timeframe[];
}

const initStore: InitStore = {
  phoneNumberTypes: [],
  maritalStatuses: [],
  coreValues: [],
  dimensionsOfLife: [],
  discoverCategories: [],
  metricsOfSuccess: [],
  complexityOfNeeds: [],
  legacyInterest: [],
  personalRelationshipTypes: [],
  itemType: [],
  shareType: [],
  timeframes: []
};

export default initStore;
