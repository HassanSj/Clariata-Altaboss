import {useState} from "react";
import usePagination from "~/ui/hooks/usePagination";
import useUserInput from "~/ui/hooks/useUserInput";
import useSearchable from "~/ui/hooks/useSearchable";
import {SortDirection} from "~/ui/constants/data";
import useSortable from "~/ui/hooks/useSortable";
import {get} from 'lodash';

const useDataPagination = (data: any[],
                           itemsPerPage: number,
                           searchField: string) => {

  // Search and filters.
  const searchText = useUserInput("");
  const searchableItems = useSearchable(
    data,
    searchText.value,
    <T>(item: T | undefined) => [`${get(item, searchField)}`]
  );

  // Sorting
  const [sortDirection, setSortDirection] = useState(SortDirection.ASC);
  const sortableItems = useSortable(
    searchableItems,
    sortDirection,
    <T>(item: T | undefined) => [`${get(item, searchField)}`],
  );

  // Pagination
  const paginator = usePagination(sortableItems, itemsPerPage);

  return {
    searchText,
    sortDirection,
    setSortDirection,
    paginator
  };
}

export default useDataPagination;
