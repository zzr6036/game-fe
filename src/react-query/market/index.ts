import { QueryOptions, useQuery } from "@tanstack/react-query";
import { fetchSymbolMarketInfo } from "../../api/market";
import { SymbolMarketType } from "../../api/market/typings";

const MARKET_INFO = 'market_info'

export function useSymbolMarketInfo(
    symbol: string,
    queryOptions?: QueryOptions
) {
    return useQuery({
        queryKey: [MARKET_INFO],
        queryFn: async () => {
            return await fetchSymbolMarketInfo(symbol)
        },
        select: (data) => {
            if (!data) return undefined
            return data as SymbolMarketType
        },
        ...queryOptions,
        enabled: Boolean(symbol),
        retry: 3,
    })
}