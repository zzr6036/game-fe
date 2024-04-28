import { useMutation } from "@tanstack/react-query";
import { login } from "../../api/auth/index";
import { message } from "antd";
import { UserInfoType } from "../../api/auth/typings";


export function useLogin() {
    return useMutation({
        mutationFn: (request: UserInfoType) => {
            return login(request)
        },
        onSuccess: data => {
            return data
        }
    })
}
