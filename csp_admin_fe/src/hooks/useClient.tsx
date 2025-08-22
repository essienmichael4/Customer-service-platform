import { useQuery } from "@tanstack/react-query"
import useAxiosToken from "./useAxiosToken"
import type { Data } from "@/lib/types"

export const useClients = (page: number, limit: number) => {
    const axios_instance_token = useAxiosToken()
    return useQuery<Data>({
        queryKey: ["clients", page, limit],
        queryFn: async() => await axios_instance_token.get(`/users/clients/all`, {
            params: { page, take: limit }
        }).then(res => {
            console.log(res.data);
            
            return res.data
        })
    })
}
