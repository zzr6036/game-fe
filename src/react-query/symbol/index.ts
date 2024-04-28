import { QueryOptions, useQuery } from "@tanstack/react-query";
import { fetchSymbols } from "../../api/symbol";

const SYMBOL_LIST = 'symbol_list'

export function useSymbolList(
    queryOptions?: QueryOptions
) {
    return useQuery({
        queryKey: [SYMBOL_LIST],
        queryFn: async () => {
            return await fetchSymbols()
        },
        select: (data) => {
            if (!data) return []
            return data as string[]
        },
        ...queryOptions
    })
}