import {useMemo} from "react";
import {orderBy} from "lodash";
import {SortDirection} from "~/ui/constants/data";
import {useStoreActions, useStoreState} from "~/store/hooks";
import useMountEvents from "~/ui/hooks/useMountEvents";
import {IDataTableView} from "~/types/data";
import {FormInputType} from "~/ui/constants/forms";

const useSortableDataTableHeaders = <T>(data: T[],
                                        tableId: string,
                                        defaultSortDirection: SortDirection,
                                        defaultSortByField: string,
                                        view?: IDataTableView) => {
  const {onTableChange, onSort} = useStoreActions(actions => actions.layout);
  const {currentTableId, sortDirection, sortByField, selectedView, selectedHeader} = useStoreState(state => state.layout);

  const getSortedData = () => {
    // Check for custom sort function
    if (selectedHeader && selectedHeader.onSort) {
      if (selectedHeader.fieldType && selectedHeader.fieldType === FormInputType.DATE) {
        // TODO - sort by date
      }
      return data  ? orderBy(data, [selectedHeader.onSort],[sortDirection]) : data;
    }

    return data ? orderBy(data, [sortByField], [sortDirection]) : data;
  }

  const setup = async () => {
    await onTableChange({
      currentTableId: tableId,
      sortDirection: defaultSortDirection,
      sortByField: defaultSortByField
    })
  }

  useMountEvents({
    onMounted: async () => {
      setup();
    },
    onChange: async () => {
      // TODO
    },
    watchItems: [currentTableId, sortDirection, sortByField]
  });

  return useMemo(() => {
    return getSortedData();
  }, [data, sortByField, sortDirection]);
};

export default useSortableDataTableHeaders;
