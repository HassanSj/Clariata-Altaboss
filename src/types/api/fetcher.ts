import axios, { AxiosRequestConfig} from "axios";
import privateAxios from "~/services/api/privateAxios";

export const fetcher = (url: string, token: string | null) => axios.get(url, { headers: { Authorization: "Bearer " + token } }).then(res => res.data);