import useSWR from "swr";
import { getAccessToken } from "~/services/auth";
import { useStoreState } from "~/store/hooks";
import { fetcher } from "~/types/api/fetcher";
import { Household } from "~/types/api/household";


const useHousehold = () => {

    const {householdId} = useStoreState((state) => state.selected);
    const token = getAccessToken();
    const { data : household, error } = useSWR<Household>([`${process.env.NEXT_PUBLIC_API_URL}/household/${householdId}`, token], fetcher);

    return {
        household: household,
        error: error
    }
}

export default useHousehold;