import useAxiosToken from "@/hooks/useAxiosToken"
import { useQueryClient } from "@tanstack/react-query"
import { useNavigate, useParams } from "react-router-dom"

const Ticket = () => {
    const {id} = useParams()
    const navigate = useNavigate()
    const axios_instance_token = useAxiosToken()
    const queryClient = useQueryClient()
    
    return (
        <div className="container mx-auto">Ticket</div>
    )
}

export default Ticket
