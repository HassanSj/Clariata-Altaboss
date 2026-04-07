import {filter} from "lodash";
import {useMemo} from "react";

const useRangeSearchables = <T>(data:T[], range:{start:any, end:any},prop:((item?:T) => any)) => {
    const notEmpty = (value:any) => {
        return value !== -1 && value !== null && value !== "";
    }

    const getSearchData = () => {
        let filterFunction;
        
        if(notEmpty(range.start) && notEmpty(range.end)){
            filterFunction = (item:T) => {
                const p = prop(item)
                return p >= range.start && p <= range.end
            }
        }else if(notEmpty(range.start)){
            filterFunction = (item:T) => {
                const p = prop(item)
                return p >= range.start
            }
        }else if(notEmpty(range.end)){
            filterFunction = (item:T) => {
                const p = prop(item)
                return p <= range.end
            }
        }else{
            return data;
        }

        return filter(data, filterFunction);
    }

    return useMemo(() => getSearchData(), [data, range, prop]);
}

export default useRangeSearchables;