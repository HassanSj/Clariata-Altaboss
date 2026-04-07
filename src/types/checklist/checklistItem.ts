import { ChecklistItem } from "../api/checklistItem";

export interface IChecklistItemCellTemplateConfig {
  props: IChecklistItemCellTemplateProps;
}

export interface IChecklistItemCellTemplateProps {
  onUpdateFields(e: import('../forms').IFormInputValue[]): any;
  checklistitem: ChecklistItem;
}
  