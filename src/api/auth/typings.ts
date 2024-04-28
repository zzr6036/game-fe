export interface UserInfoType {
    pin: string,
    symbol: string
}

export interface LoginResponse {
    symbol: string,
    symbolInfo: {
        baseCurrency: string
        baseIncrement: string
        baseMaxSize: string
        baseMinSize: string
        enableTrading: boolean
        feeCurrency: string
        isMarginEnabled: boolean
        market: string
        minFunds: string
        name: string
        priceIncrement: string
        priceLimitRate: string
        quoteCurrency: string
        quoteIncrement: string
        quoteMaxSize: string
        quoteMinSize: string
        symbol: string
    },
    kucoinTokenInfo: {
        token: string,
        instanceServers: {
            encrypt: boolean
            endpoint: string
            pingInterval: number
            pingTimeout: number
            protocol: string
        }[]
    }
}