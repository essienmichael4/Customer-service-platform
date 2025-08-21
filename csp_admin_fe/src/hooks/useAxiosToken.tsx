import { useEffect } from 'react'
import useAuth from './useAuth'
import useRefreshToken from './useRefreshToken'
import { axios_instance_token } from '@/api/axios'
import { useNavigate } from 'react-router-dom'

const useAxiosToken = () => {
    const {auth} =useAuth()
    const navigate = useNavigate()
    const refresh = useRefreshToken()

    useEffect(()=>{

        const requestInterceptor = axios_instance_token.interceptors.request.use(
            config => {
                if(!config.headers['Authorization']){
                    config.headers['Authorization'] = `Bearer ${auth?.backendTokens.accessToken}`
                }
                return config
            }, (error) => Promise.reject(error)
        )

        const responseInterceptor = axios_instance_token.interceptors.response.use(
            response => response,
            async (error) =>{
                const previousRequest = error?.config
                if(error?.response?.status === 401 && !previousRequest?.sent){
                    previousRequest.sent = true

                    const newAccessToken = await refresh()
                    previousRequest.headers['Authorization'] = `Bearer ${newAccessToken}`
                    return axios_instance_token(previousRequest)
                }
                if(error?.response?.status === 401 && previousRequest?.sent){
                    navigate("../")
                }
                return Promise.reject(error)
            }
        )

        return () => {
            axios_instance_token.interceptors.request.eject(requestInterceptor)
            axios_instance_token.interceptors.response.eject(responseInterceptor)
        }
    },[auth, refresh])
    
    return axios_instance_token 
}

export default useAxiosToken
