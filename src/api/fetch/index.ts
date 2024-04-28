import queryString from 'query-string'
import { LOGIN_INFO } from '../../constant'

export type FetchFromServerRequest = {
    url: string
    method?: 'GET' | 'PUT' | 'PATCH' | 'POST' | 'DELETE' | 'HEAD'
    payload?: any
    headers?: {
        // Empty
    }
}

export type FetchFromServerResponse<T = unknown> = {
    status: string,
    message: string,
    data?: T
}

export const jsonHeaders = {
    Accept: 'application/json',
    cache: 'no-cache',
    'Content-Type': 'application/json;charset=UTF-8',
    'Access-Control-Allow-Origin': '*',
}

export async function fetchFromServer<T>({
    url,
    method = 'GET',
    payload,
    headers
}: FetchFromServerRequest
): Promise<T> {
    const request = {
        url,
        method,
        payload,
        headers
    }
    const response = await fetchRaw(request)
    if (!response.ok) {
        if (response.status === 401 && response.statusText === 'Unauthorized') {
            localStorage.removeItem(LOGIN_INFO)
        }
        throw new Error(`Request Failed: ${response.statusText}`)
    } else {
        const result = (await response.json()) as FetchFromServerResponse<T>
        const data = result.data ?? (result as unknown as T)
        return data
    }
}

export function fetchRaw({
    url,
    method = 'GET',
    payload,
    headers
}: FetchFromServerRequest) {
    return fetch(
        (method === 'GET' || method === 'HEAD') && payload ?
            `${url}?${queryString.stringify(payload)}` : url,
        {
            credentials: 'include',
            method,
            headers,
            body: payload && method !== 'GET' || method !== 'HEAD' ? JSON.stringify(payload) : undefined
        }
    )
}