import {useMemo} from "react";
import {chain} from "lodash";

const useGroupable = <T>(data: T[],
                         isGrouped: boolean,
                         groupByField: string,
                         labels?: { [key: string]: { value: any, label: string }}) => {

    const getGroupedData = () => {
        return chain(data)
            .groupBy(groupByField)
            .map((value: any, key: any) => {
                const label = labels && labels[key] ? labels[key].label : key;
                return ({ label, items: value });
            })
            .value()
    }

    return useMemo(() => {
        return data && isGrouped ? getGroupedData() : data;
    }, [data, groupByField]);
};

export default useGroupable;
