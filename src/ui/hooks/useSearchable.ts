import {useMemo} from "react";

const useSearchable = <T>(data: T[] |undefined,
                          searchText: any,
                          searchProps: (item: T | undefined) => string[]) => {

  const getSearchedData = () => {
    const regex = new RegExp(searchText, "i");
    // -1 === all
    return data && (searchText !== '-1' && searchText !== -1) ? data.filter((item) =>
        searchProps(item).some((sp) => regex.test(sp))
    ) : data;
  }

  return useMemo(() => getSearchedData(), [data, searchText, searchProps]);
};

export default useSearchable;
