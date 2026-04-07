import useSWR from "swr";
import { getAccessToken } from "~/services/auth";
import { useStoreState } from "~/store/hooks";
import { fetcher } from "~/types/api/fetcher";
import { Person } from "~/types/api/person";

const usePersons = () => {

    const {householdId} = useStoreState((state) => state.selected);
    const token = getAccessToken();
    const { data, error } = useSWR<Person[]>([`${process.env.NEXT_PUBLIC_API_URL}/household/${householdId}/person/list`, token], fetcher);

    return {
        persons: data,
        error: error
    }
}

export default usePersons;