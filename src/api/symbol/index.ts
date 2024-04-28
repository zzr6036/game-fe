import { getSymbolUrl } from '../../utils/urls'
import { fetchFromServer, jsonHeaders } from '../fetch'

export function fetchSymbols() {
    return fetchFromServer<string[]>({
        url: getSymbolUrl(),
        method: 'GET',
        headers: jsonHeaders
    })
}