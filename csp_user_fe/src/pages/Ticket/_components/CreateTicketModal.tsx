import useAxiosToken from "@/hooks/useAxiosToken"
import { useQueryClient } from "@tanstack/react-query"
import { useState } from "react"

interface Props{
    trigger?: React.ReactNode,
}

const CreateTicketModal = ({trigger}:Props) => {
  const [open, setOpen] = useState(false)
  const axios_instance_token = useAxiosToken()
  const queryClient = useQueryClient()
  
  return (
    <div>CreateTicketModal</div>
  )
}

export default CreateTicketModal
