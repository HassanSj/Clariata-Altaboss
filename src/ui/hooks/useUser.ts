import useSWR from "swr";
import { getAccessToken } from "~/services/auth";
import { useStoreState } from "~/store/hooks";
import { fetcher } from "~/types/api/fetcher";
import { User } from "~/types/api/user";


const useUser = () => {

    const token = getAccessToken();
    const { data, error } = useSWR<User>([`${process.env.NEXT_PUBLIC_API_URL}/user/`, token], fetcher);

    return {
        user: data,
        error: error
    }
}

export default useUser;