import { IUserStorageModel } from './user/store';
import { ILayoutStoreModel } from './layout/store';
import { IHouseholdStoreModel } from "~/types/household/store";
import { IClientEvaluationStoreModel } from "~/types/evaluation/store";
import { IObjectiveStoreModel } from "~/types/objective/store";
import { IPersonStoreModel } from "~/types/person/store";
import { IWizardStoreModel } from "~/types/wizard/store";
import { IInterviewStoreModel } from "~/types/interview/store";
import { IDestinyStoreModel } from '~/types/destiny/store';
import { IChecklistStoreModel } from './checklist/store';
import { ISelectedStoreModel } from './selected/store';
import { IContactStoreModel } from './contact/store';

export interface IStoreModel {
  user: IUserStorageModel;
  layout: ILayoutStoreModel;
  household: IHouseholdStoreModel;
  evaluation: IClientEvaluationStoreModel;
  objective: IObjectiveStoreModel;
  constants: IConstantTypesStoreModel;
  person: IPersonStoreModel;
  wizard: IWizardStoreModel;
  interview: IInterviewStoreModel;
  destiny: IDestinyStoreModel;
  checklist: IChecklistStoreModel;
  selected: ISelectedStoreModel;
  contact: IContactStoreModel;
}

export interface StoreInterface {
  user: IUserStorageModel;
  layout: ILayoutStoreModel;
  household: IHouseholdStoreModel;
  destiny: IDestinyStoreModel;
  evaluation: IClientEvaluationStoreModel;
  objective: IObjectiveStoreModel;
  constants: IConstantTypesStoreModel;
  person: IPersonStoreModel;
  wizard: IWizardStoreModel;
  interview: IInterviewStoreModel;
  checklist: IChecklistStoreModel;
  selected: ISelectedStoreModel;
  contact: IContactStoreModel;
}
