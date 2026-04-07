import useSWR from "swr";
import { getAccessToken } from "~/services/auth";
import { fetcher } from "~/types/api/fetcher";
import { ClientEvaluation } from "~/types/api/clientEvaluation";


const useEvaluations = () => {

    const token = getAccessToken();
    const { data, error } = useSWR<ClientEvaluation[]>([`${process.env.NEXT_PUBLIC_API_URL}/clientevaluation/list`, token], fetcher, {refreshInterval:1000});

    return {
        evaluations: data,
        error: error
    }
}

export default useEvaluations;