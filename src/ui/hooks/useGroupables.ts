import {useMemo} from "react";
import {chain, get} from "lodash";

const useGroupables = <T>(data: T[],
                         isGrouped: boolean,
                         groupByField: string|((item:any)=>string),
                         groups?: { [key: string]: { value: any, label: string, labelField: string, labels?: any[] }}) => {

  const getGroupedData = () => {
    return chain(data)
      .groupBy(groupByField)
      .map((value: any, key: any) => {
          if(typeof groupByField !== 'string') {
              return ({label: key == 1 ? "Not started" : key, items: value});
          }

          let l;
          if (value && groups && groups[groupByField] && groups[groupByField].labels) {
              l = groups[groupByField].labels?.find(((l: any) => {
                  return String(key) === String(get(l, groupByField));
              }));
          }
          const label = l && groups && groups[groupByField]?.labelField ?
            l[groups[groupByField]?.labelField] : key;
          return ({ label, items: value });
      })
      .value()
  }

  return useMemo(() => {
    return data && isGrouped ? getGroupedData() : data;
  }, [data, isGrouped, groupByField, groups]);
};

export default useGroupables;
