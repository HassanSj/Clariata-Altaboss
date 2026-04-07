import useSWR from "swr";
import { getAccessToken } from "~/services/auth";
import { useStoreState } from "~/store/hooks";
import { fetcher } from "~/types/api/fetcher";
import { Objective } from "~/types/api/objective";

const useObjectives = (id: number) => {

    const {householdId} = useStoreState((state) => state.selected);
    const token = getAccessToken();
    const urlObjectives = `${process.env.NEXT_PUBLIC_API_URL}/household/${householdId}/interview/${id}/objective/list`;
    const { data, error } = useSWR<Objective[]>([urlObjectives, token], fetcher);

    return {
        objectives: data,
        error: error
    }
}

export default useObjectives;