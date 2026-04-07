import {useMemo} from "react";
import {hasItems, isAfter, isBefore, isValidDate} from "~/ui/constants/utils";
import {get} from 'lodash';

const useDateFilterable = <T>(data: T[],
                           searchDate: string | undefined,
                           searchField: string | undefined,
                           beforeOrAfter: 'before' | 'after') => {

  const getSearchedData = () => {
    if (!searchDate) {
      return data;
    }
    let result: any[] = [];
    if (searchDate && data) {
      const filtered = data.filter(o => {
        if (searchField) {
          try {
            const baseDate = new Date(searchDate);
            const dateStr = get(o, searchField);
            const date = new Date(dateStr);
            if (beforeOrAfter === 'before'
              && isValidDate(date)
              && isBefore(baseDate, date)) {
              return true;
            } else if (beforeOrAfter === 'after'
              && isValidDate(date)
              && isAfter(baseDate, date)) {
              return true;
            }
            return false;
          } catch (e) {
            return false;
          }
        }

        return false;
      });
      // Return filtered items
      if (hasItems(filtered)) {
        result.push(...filtered);
      }
    } else {
      result = Object.assign([], data);
    }

    return result;
  }

  return useMemo(() => getSearchedData(), [
    data,
    searchDate,
    searchField,
    beforeOrAfter
  ]);
};
export default useDateFilterable;
