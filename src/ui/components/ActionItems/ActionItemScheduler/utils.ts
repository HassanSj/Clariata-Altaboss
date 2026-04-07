import {ActionItem} from "~/types/api/actionItem";
import {DateTime} from "luxon";
import {random} from "lodash";
import {addDays, isValidDate} from "~/ui/constants/utils";

export const schedulerFields = {
  id: 'ActionItemID',
  title: 'Description',
  start: 'StartDate',
  end: 'CompletionDate',
  recurrenceRule: 'RecurrenceRule',
  recurrenceId: 'RecurrenceID',
  recurrenceExceptions: 'RecurrenceException',
};

export const toSchedulerEvents = (actionItems: ActionItem[] | undefined) => {
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
      isAllDay: (startDate === endDate),
      RecurrenceRule: null,
      RecurrenceID: null,
      RecurrenceException: null
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

export const DATE_MULTIPLIER = 1.5;
export const DATE_FORMAT = DateTime.DATE_SHORT;
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
