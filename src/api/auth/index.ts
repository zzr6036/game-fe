import { loginUrl, sessionValidateUrl } from '../../utils/urls'
import { fetchFromServer, jsonHeaders } from '../fetch'
import { LoginResponse, UserInfoType } from './typings'

export function login(userInfo: UserInfoType) {
    return fetchFromServer<LoginResponse>({
        url: loginUrl(),
        method: 'POST',
        payload: userInfo,
        headers: jsonHeaders
    })
}

export function sessionValidate() {
    return fetchFromServer({
        url: sessionValidateUrl(),
        method: 'POST',
        headers: jsonHeaders
    })
}