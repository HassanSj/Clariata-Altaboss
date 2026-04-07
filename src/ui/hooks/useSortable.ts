import {useMemo} from "react";
import {orderBy} from "lodash";
import {SortDirection} from "~/ui/constants/data";

const useSortable = <T>(data: T[] | undefined,
                        sortDirection: SortDirection,
                        sortByField: (item: T | undefined) => string[] | number[] | undefined[]) => {
  const getSortedData = () => {
    return data  ? orderBy(data, [sortByField],[sortDirection]) : data;
  }

  return useMemo(() => {
    return getSortedData();
  }, [data, sortByField, sortDirection]);
};

export default useSortable;
