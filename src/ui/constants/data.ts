import {get} from 'lodash';
import {isNumber as checkNumber} from 'lodash';
import {HTML5Backend} from "react-dnd-html5-backend";

export const DEFAULT_DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';
export const DEFAULT_CURRENCY = 'USD';

// Singleton constant for managing the drag/drop functionality
export const DRAG_AND_DROP_BE = HTML5Backend;

export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc'
}

export enum CrudActionType {
  CREATE = 1,
  UPDATE = 2,
  DELETE = 3,
  READ = 4,
  MOVE = 5
}

export enum FilterType {
  SEARCH = 1,
  SELECT = 2
}

export enum ConditionSatisfactionType {
  AND = 1,
  OR = 2
}

export enum ConditionOperatorType {
  EQUAL_TO,
  NOT_EQUAL_TO,
  GREATER_THAN,
  GREATER_THAN_EQUAL_TO,
  LESS_THAN,
  LESS_THAN_EQUAL_TO,
  IN,
  NIN,
  ALL,
  SIZE,
  EXISTS,
  NOT_EXIST
}

/**
 * Generic implementation of performing a crud action on an array.
 * Optimized for use w/ Redux.
 * @param data
 * @param item
 * @param actionType
 * @param idField
 */
const updateData = <T>(data: T[],
                       item: T,
                       actionType: CrudActionType,
                       idField: string): T[] | undefined => {
  if (!data || data?.length <= 0) return data;

  if (CrudActionType.CREATE === actionType) {
    return [...data, item];
  }
  else if (CrudActionType.UPDATE === actionType) {
    const index = data?.findIndex((i) => get(i, idField) === get(item, idField));
    if (index > -1) data[index] = item;
    return data;
  }
  else if (CrudActionType.DELETE === actionType) {
    const index = data?.findIndex((i) => get(i, idField) === get(item, idField));
    if (index > -1) {
      return [...data.slice(0, index), ...data.slice(index + 1)];
    } else {
      return data;
    }
  }
}

/**
 * Move an item in an array using a reference item to determine it's index.
 * NOTE: primarily used for drag and drop
 * @param data
 * @param fieldName
 * @param fromFieldValue
 * @param toFieldValue
 */
export const moveItemByField = <T>(data: T[], fieldName: string, fromFieldValue: string, toFieldValue: string): T[] | undefined => {
  const itemToMoveIndex = data?.findIndex(i => String(get(i, fieldName)) === String(fromFieldValue));
  let targetReferenceItemIndex = data?.findIndex(i => String(get(i, fieldName)) === String(toFieldValue));

  if (itemToMoveIndex > -1 && targetReferenceItemIndex > -1) {
    if(itemToMoveIndex < targetReferenceItemIndex)
      targetReferenceItemIndex -= 1

    if(itemToMoveIndex !== targetReferenceItemIndex)
      return moveItemToIndex(data, itemToMoveIndex, targetReferenceItemIndex);
  }
  return data;
}

/**
 * Move an item in an array to another index.
 * @param data
 * @param fromIndex
 * @param toIndex
 */
export const moveItemToIndex = <T>(data: any[], fromIndex: number, toIndex: number): T[] | undefined => {
  if (!data || data?.length <= 0) return data;

  if (toIndex >= data.length) {
    let k = toIndex - data.length + 1;
    while (k--) {
      data.push(undefined);
    }
  }
  data.splice(toIndex, 0, data.splice(fromIndex, 1)[0]);
  return data;
}

/**
 * Remove an item at a specific index.
 * @param data
 * @param index
 */
export const removeItemAtIndex = <T>(data: T[] | undefined, index: number): T[] | undefined => {
  if (!data || data?.length <= 0) return data;

  return data.splice(0, index);
}

/**
 * Check if a condition is satisfied.
 * @param base
 * @param operator
 * @param comparitor
 */
export const isConditionSatisfied = (base: any, operator: ConditionOperatorType, comparitor: any): boolean => {
  let result = false;
  const isString = (base instanceof String);
  if (isString) {
    switch(operator){
      case ConditionOperatorType.EQUAL_TO:
        result = (base === comparitor);
        break;
      case ConditionOperatorType.NOT_EQUAL_TO:
        result = (base !== comparitor);
        break;
      case ConditionOperatorType.GREATER_THAN:
        result = (base?.length > comparitor?.length);
        break;
      case ConditionOperatorType.GREATER_THAN_EQUAL_TO:
        result = (base?.length >= comparitor?.length);
        break;
      case ConditionOperatorType.LESS_THAN:
        result = (base?.length <= comparitor?.length);
        break;
      case ConditionOperatorType.LESS_THAN_EQUAL_TO:
        result = (base?.length <= comparitor?.length);
        break;
      case ConditionOperatorType.IN:
        result = (base?.includes(comparitor));
        break;
      case ConditionOperatorType.NIN:
        result = (!base?.includes(comparitor));
        break;
      case ConditionOperatorType.EXISTS:
        result = Boolean(base);
        break;
      case ConditionOperatorType.NOT_EXIST:
        result = !Boolean(base);
        break;
    }
  }
  const isNumber = checkNumber(base);
  if (isNumber) {
    switch(operator){
      case ConditionOperatorType.EQUAL_TO:
        result = (base === comparitor);
        break;
      case ConditionOperatorType.NOT_EQUAL_TO:
        result = (base !== comparitor);
        break;
      case ConditionOperatorType.GREATER_THAN:
        result = (base > comparitor);
        break;
      case ConditionOperatorType.GREATER_THAN_EQUAL_TO:
        result = (base >= comparitor);
        break;
      case ConditionOperatorType.LESS_THAN:
        result = (base <= comparitor);
        break;
      case ConditionOperatorType.LESS_THAN_EQUAL_TO:
        result = (base <= comparitor);
        break;
      case ConditionOperatorType.IN:
        result = (base?.includes(comparitor));
        break;
      case ConditionOperatorType.NIN:
        result = (!base?.includes(comparitor));
        break;
      case ConditionOperatorType.EXISTS:
        result = Boolean(base);
        break;
      case ConditionOperatorType.NOT_EXIST:
        result = !Boolean(base);
        break;
    }
  }

  return result;
}
