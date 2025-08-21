import useAuth from './useAuth'
import axios from 'axios'

const useRefreshToken = () => {
    const {auth, dispatch} = useAuth()

    const refresh = async ()=>{
        const response = await axios.get(`"http://localhost:3000/api/v1/auth/refresh`, {
            headers: {
                'Authorization': `Refresh ${auth?.backendTokens.refreshToken}`
            }
        })

        dispatch({type: "ADD_AUTH", payload:{
            id: auth?.id,
            name: auth!.name,
            email: auth!.email,
            backendTokens: {
                accessToken: response.data?.accessToken,
                refreshToken: auth!.backendTokens.refreshToken
            }
        }})
        
        return response.data.accessToken
    }

    return refresh
}

export default useRefreshToken
