import {useMemo} from "react";
import {addDays, hasItems, isAfter, isBeforeDaysFromNow, isValidDate} from "~/ui/constants/utils";
import {get} from 'lodash';

const useDatePeriodFilterable = <T>(data: T[],
                              searchField: string | undefined,
                              periodsFromNow: number) => {

  const getSearchedData = () => {
    if (periodsFromNow === 0) {
      return data;
    }
    let result: any[] = [];
    if (data) {
      const filtered = data.filter(o => {
        if (searchField) {
          try {
            const now = new Date();
            const dateStr = get(o, searchField);
            const date = new Date(dateStr);
            const testDate = addDays(new Date(), 80);
            if (isValidDate(date)
              && isAfter(now, date)
              && isBeforeDaysFromNow(dateStr, periodsFromNow)) {
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
    searchField,
    periodsFromNow
  ]);
};
export default useDatePeriodFilterable;
