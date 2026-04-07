import {ActionItem} from "~/types/api/actionItem";
import {GanttDateFilter, GanttTextFilter} from "@progress/kendo-react-gantt";
import {addDays, isValidDate} from "~/ui/constants/utils";
import {random} from 'lodash';
import {DateTime} from 'luxon';


export const ganttFields = {
  id: 'ActionItemID',
  start: 'StartDate',
  end: 'CompletionDate',
  title: 'Description',
  children: 'ActionItemList',
  isRollup: 'isRollup',
  isExpanded: 'isExpanded',
  isInEdit: 'isInEdit',
}

export const ganttDependencyModelFields = {
  id: 'id',
  fromId: 'fromId',
  toId: 'toId',
  type: 'type'
}

export const ganttColumns = [
  { field: ganttFields.id, title: 'ID', width: 70},
  { field: ganttFields.title, title: 'Description', width: 200, expandable: true, filter: GanttTextFilter },
  { field: ganttFields.start, title: 'Start', width: 120, format: '{0:MM/dd/yyyy}', filter: GanttDateFilter },
  { field: ganttFields.end, title: 'End', width: 120, format: '{0:MM/dd/yyyy}', filter: GanttDateFilter }
];

export const toGanttTasks = (actionItems: ActionItem[] | undefined) => {
  const valid: any[] = [];
  const invalid: any[] = [];

  actionItems?.forEach((a: ActionItem, index: number) => {
    const lastDate = (isValidDate(a.CompletionDate) && a.CompletionDate) ? new Date(a.CompletionDate) : (isValidDate(a.DueDate) && a.DueDate ? new Date(a.DueDate) : null);
    const startDate = a.StartDate ? new Date(a.StartDate) : null;
    const endDate = (lastDate ? lastDate : (startDate ? addDays(startDate, 1) : null));
    const isValid = isValidDate(a?.StartDate);

    const item = {
      ...a,
      StartDate: startDate,
      CompletionDate: endDate,
      isExpanded: false,
      isRollup: false,
      isInEdit: false
    };

    if (isValid) {
      valid.push(item);
    } else {
      invalid.push(item);
    }
  });

  return {
    valid,
    invalid
  };
}

export const toGanttDependencies = (actionItems: ActionItem[] | undefined) => {
  let prevAction: ActionItem;
  const result = actionItems?.map((a: ActionItem, index: number) => {
    const dep = {
      id: a?.ActionItemID,
      fromId: a?.ActionItemID,
      toId: prevAction?.ActionItemID,
      type: 0
    };
    prevAction = a;
    return dep;
  });

  return result;
}

export const DATE_MULTIPLIER = 1.5;
export const DATE_FORMAT = DateTime.DATE_SHORT;
export const DISPLAY_DATE = new Date();
export const INITIAL_DATE = DateTime.local().plus({ days: -30 });

export const getStartDate = (index: number) => {
  const date = INITIAL_DATE.plus({ days: (DATE_MULTIPLIER * (index - 8)) });
  return date.toJSDate();
}

export const getEndDate = (startDate: Date) => {
  const date = DateTime.fromJSDate(startDate).plus({ days: getRandom() });
  return date.toJSDate();
}

export const getRandom = () => {
  return random(1, 6);
}
