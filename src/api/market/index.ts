import { getSymbolMarketInfoUrl } from '../../utils/urls'
import { fetchFromServer, jsonHeaders } from '../fetch'
import { SymbolMarketType } from './typings'

export function fetchSymbolMarketInfo(symbol: string) {
    return fetchFromServer<SymbolMarketType>({
        url: getSymbolMarketInfoUrl(symbol),
        method: 'GET',
        headers: {
            ...jsonHeaders
        }
    })
}