import {useMemo} from "react";
import {hasItems} from "~/ui/constants/utils";

const useSearchables = <T>(data: T[],
                          searchTexts: any[],
                          searchProps: (item: T | undefined) => string[]) => {
    const getSearchedData = () => {
        console.log("Search Text :", searchTexts)
        let result: any[] = [];
        if (hasItems(searchTexts) && Array.isArray(searchTexts)) {
            searchTexts?.forEach((s: any) => {
                const regex = new RegExp(s, "i");
                const filtered = s && (s !== '-1' && s !== -1)
                    ? (data.filter((item) => searchProps(item).some((sp) => regex.test(sp))))
                    : [];
                if (hasItems(filtered)) {
                    result.push(...filtered);
                }
            })
        } else {
            result = Object.assign([], data);
        }

        return result;
    }

    return getSearchedData()
    // return useMemo(() => getSearchedData(), [data, searchTexts, searchProps]);
};
export default useSearchables;
