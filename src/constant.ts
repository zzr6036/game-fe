import { createContext } from "react"

export const LOGIN_INFO = 'LOGIN_INFO'

export const UserInfoContext = createContext<{
    symbol: string
    token: string
}>({
    symbol: '',
    token: '',
})