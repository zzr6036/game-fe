const baseUrl = process.env.REACT_APP_BASE_URL

export const getSymbolUrl = () => `${baseUrl}/v1/symbols`

export const loginUrl = () => `${baseUrl}/v1/login`

export const getSymbolMarketInfoUrl = (symbol: string) => `${baseUrl}/v1/market/orderbook/level2_100?symbol=${symbol}`

export const sessionValidateUrl = () => `${baseUrl}/v1/session_validate`

export const webSocketBaseUrl = (token: string) => `wss://ws-api.kucoin.com/endpoint?connectId=8888&token=${token}`