import {Person} from "./person";
import {ActionItemMilestone} from "~/types/api/actionItemMilestone";
import {ActionItemStakeholder} from "~/types/api/actionItemStakeholder";
import {Objective} from "./models";
import {Comment as CommentItem} from "./comment";

export interface ActionItem {
  ActionItemID?: number;
  ParentActionItemID?: number;
  ObjectiveID: number;
  Description?: string;
  StartDate?: Date;
  DueDate?: Date;
  CompletionDate?: Date;
  StartMonthDate?: Date;
  StartMonthOffset?: number;
  ActionItemStatusID?: number;
  LeadPerson?: number;
  EstimatedCost?: number;
  ActualCost?: number;
  InformationNeeded?: string;
  ResourceNeeds?: string;
  Prework?: string;
  CommentSetID?: number;
  DIY?:boolean;
  AssistanceNeeded?: number;
  CreationDate?: string;
  CreatedBy?: number;
  LastModifiedDate?: string;
  LastModifiedBy?: number;
  PercentComplete?: number;

  RecurrenceType?: number;
  RecurrenceInterval?: number;

  Objective?: Objective;
  ParentActionItem?: ActionItem;
  Person?: Person;
  Stakeholders?: ActionItemStakeholder[];
  ActionItemList?: ActionItem[];
  Milestones?: ActionItemMilestone[];
  Comments?: CommentItem[];
}
