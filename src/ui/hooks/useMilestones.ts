import useSWR from "swr";
import { getAccessToken } from "~/services/auth";
import { useStoreState } from "~/store/hooks";
import { fetcher } from "~/types/api/fetcher";
import { Milestone } from "~/types/api/milestone";

const useMilestones = () => {

    const {deepenActionItemId} = useStoreState((state) => state.selected);
    const token = getAccessToken();
    const { data, error } = useSWR<Milestone[]>([`${process.env.NEXT_PUBLIC_API_URL}/MilestoneByActionItem?actionItemId=${deepenActionItemId}`, token], fetcher, { refreshInterval: 1000 });

    return {
        milestones: data,
        error: error
    }
}

export default useMilestones;