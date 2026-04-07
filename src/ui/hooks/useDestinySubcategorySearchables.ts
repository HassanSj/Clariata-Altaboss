import {useMemo} from "react";
import {hasItems} from "~/ui/constants/utils";
import { CategoryItem, SubcategoryItem } from "../pages/Destiny/Destiny";

const useDestinySubcategorySearchables = <T>(data: CategoryItem[],
                          searchTexts: any[] ) => {
    const getSearchedData = () => {
        let result: any[] = [];
        if (hasItems(searchTexts) && Array.isArray(searchTexts)) {
            const filtered = data
              ? data.filter(item => {
                  item.subcategories.filter(subcat => {
                    if(searchTexts.includes(subcat.subcategory)){
                        return subcat;
                    }
                  });
                })
              : [];
            if (filtered && hasItems(filtered)) {
                result.push(...filtered);
            }
        } else {
            result = Object.assign([], data);
        }

        return result;
    }

    return getSearchedData()
    // return useMemo(() => getSearchedData(), [data, searchTexts, searchProps]);
};
export default useDestinySubcategorySearchables;
