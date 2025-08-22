import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb"
import useAxiosToken from "@/hooks/useAxiosToken"
import type { User } from "@/lib/types"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { ArrowDownSquare, ArrowLeft, Languages, Mail, MapPin, Phone, Plus } from "lucide-react"
import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import CustomerStats from "./_components/CustomerStats"
import CustomerTickets from "./_components/CustomerTickets"

const Client = () => {
    const [open, setOpen] = useState(false)
    const {id} = useParams()
    const navigate = useNavigate()
    const axios_instance_token = useAxiosToken()
    const queryClient = useQueryClient()
    const handleOpenChange= () => {setOpen(!open)}

    const userQuery = useQuery<User>({
        queryKey: ["users", id],
        queryFn: async() => await axios_instance_token.get(`/users/${id}`).then(res => {
            console.log(res.data);
            
            return res.data
        })
    })

    return (
        <div className="lg:container px-4 mx-auto text-sm min-h-[90vh]">
            <Breadcrumb className="mt-1">
                <BreadcrumbList>
                    <BreadcrumbItem>
                    <BreadcrumbLink href="../clients" className="text-xs">Clients</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="text-xs"/>
                    <BreadcrumbItem>
                    <BreadcrumbPage className="text-xs">{id}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div className="mt-1 flex justify-between items-center">
                {/* <h3 className="font-bold">Tickets</h3> */}
                <div className="flex items-center gap-4">
                    <button onClick={()=> navigate(-1)} className="flex items-center justify-center w-6 h-6  rounded-full text-gray-400 hover:text-gray-600 hover:border-gray-600">
                        <ArrowLeft className="w-4 h-4" />
                    </button>
                </div>
                <div>
                    <button onClick={()=>handleOpenChange()}  className="py-2 px-2 md:px-4 flex items-center rounded-md bg-gradient-to-r from-blue-500 to-blue-800 text-white">
                        <Plus className="w-4 h-4 mr-2 text-white"/> <span className="text-xs md:text-sm">Add New Ticket</span>
                    </button>
                </div>
            </div>
            <div>
                <div className="flex items-center gap-2">
                    <div className="w-16 h-16 rounded-full border"></div>
                    <div>
                        <h2 className="text-xl font-bold my-0">{userQuery.data?.name}</h2>
                        <p className="text-xs">{userQuery.data?.email}</p>
                    </div>
                </div>
            </div>
            <div className="flex">
                <div className="w-1/4">
                    <div className="p-2">
                        <h3 className="font-semibold text-gray-400 mb-8">Customer Details</h3>
                        <div className="mb-6">
                            <div className="flex text-xs items-center text-gray-400 gap-2"><ArrowDownSquare className="w-4 h-4"/> Source</div>
                            <p className="text-md">Login form</p>
                        </div>
                        <div className="mb-6">
                            <div className="flex text-xs items-center text-gray-400 gap-2"><Phone className="w-4 h-4"/> Phone Number</div>
                            <p className="text-md text-cyan-700">-</p>
                        </div>
                        <div className="mb-6">
                            <div className="flex text-xs items-center text-gray-400 gap-2"><Mail className="w-4 h-4"/> Email</div>
                            <p className="text-md text-cyan-700">{userQuery.data?.email}</p>
                        </div>
                        <div className="mb-6">
                            <div className="flex text-xs items-center text-gray-400 gap-2"><MapPin className="w-4 h-4"/> Location</div>
                            <p className="text-md">-</p>
                        </div>
                        <div className="mb-6">
                            <div className="flex text-xs items-center text-gray-400 gap-2"><Languages className="w-4 h-4"/> Language Spoken</div>
                            <p className="text-md">-</p>
                        </div>
                    </div>
                </div>
                <div className="w-3/4">
                    <div className="p-2">
                        <CustomerStats />
                        <CustomerTickets id={Number(id)} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Client
