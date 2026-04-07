import useSWR from "swr";
import { getAccessToken } from "~/services/auth";
import { useStoreState } from "~/store/hooks";
import { fetcher } from "~/types/api/fetcher";
import { Household } from "~/types/api/household";


const useHouseholds = () => {

    const token = getAccessToken();
    const { data, error } = useSWR<Household[]>([`${process.env.NEXT_PUBLIC_API_URL}/household/list`, token], fetcher, {refreshInterval:1000});

    return {
        households: data,
        error: error
    }
}

export default useHouseholds;