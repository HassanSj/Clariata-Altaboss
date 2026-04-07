import {Objective} from "~/types/api/objective";
import {IFormInputValue} from "~/types/forms";
import {Household} from "~/types/api/household";
import {Person} from "~/types/api/person";
import {ActionItem} from "~/types/api/actionItem";
import {MetricOfSuccess} from "~/types/api/metricOfSuccess";
import {DimensionOfLife} from "~/types/api/dimensionOfLife";
import {ObjectiveStakeholder} from "~/types/api/objectiveStakeholder";
import { DirectionTask } from "../api/directionTask";

export interface IPriorityItemCellTemplateConfig {
  props: IPriorityItemCellTemplateProps;
}

export interface IPriorityItemCellTemplateProps {
  objective: Objective;
  directionTask?: DirectionTask;
  selected?: Objective;
  household: Household;
  person?: Person;
  persons?: Person[];
  connections?: Person[];
  metricOfSuccess?: MetricOfSuccess;
  dimensionOfLife?: DimensionOfLife;
  setShowActionItems?: any;
  showActionItems?: boolean;
  onUpdateFields: (values: IFormInputValue[]) => any;
  onEditStakeholder?: (stakeholder: ObjectiveStakeholder) => any;
  onEdit: () => any;
  onSelect: () => any;
  onToggle?: () => any;
  locked?: boolean;
}

export interface IObjectiveCellTemplateConfig {
  props: IObjectiveCellTemplateProps;
}


export interface IActionItemCellTemplateConfig {
  props: IActionItemCellTemplateProps;
}

export interface IObjectiveCellTemplateProps {
  item: Objective;
  type?: "month" | "year";
  selected?: Objective;
  objectives?: Objective[];
  person?: Person;
  persons?: Person[];
  setShowActionItems?: any;
  showActionItems?: boolean;
  onUpdateFields?: (values: IFormInputValue[]) => any;
  onEdit?: () => any;
  onSelect?: () => any;
  onToggle?: () => any;
}

export interface IActionItemCellTemplateProps {
  item: ActionItem;
  type?: "month" | "year";
  selected?: ActionItem;
  household: Household;
  objective?: Objective;
  objectives?: Objective[];
  person?: Person;
  persons?: Person[];
  setShowActionItems?: any;
  showActionItems?: boolean;
  onUpdateFields: (values: IFormInputValue[]) => any;
  onEdit: () => any;
  onSelect: () => any;
  onToggle?: () => any;
}