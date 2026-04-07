import useSWR from "swr";
import { getAccessToken } from "~/services/auth";
import { useStoreState } from "~/store/hooks";
import { fetcher } from "~/types/api/fetcher";
import { Household } from "~/types/api/household";
import { TeamMember } from "~/types/api/teamMember";


const useTeam = (userId: number) => {

    const token = getAccessToken();
    const { data, error } = useSWR<TeamMember[]>([`${process.env.NEXT_PUBLIC_API_URL}/team/${userId}`, token], fetcher);

    return {
        team: data,
        error: error
    }
}

export default useTeam;