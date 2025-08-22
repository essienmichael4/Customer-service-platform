import { Plus, Search } from "lucide-react"
import { useState } from "react"
import AllCustomer from "./_components/AllCustomer"

const Clients = () => {
    const [open, setOpen] = useState(false)
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(20)
    const [filtering, setFiltering] = useState("")
    return (
        <div className="lg:container px-4 mx-auto text-sm min-h-[90vh]">
            <div className="mt-4 flex justify-between items-center">
                {/* <h3 className="font-bold">Tickets</h3> */}
                <div className="w-full sm:w-[320px]">
                    <div className="flex w-full border h-full items-center px-2 py-2 gap-2 rounded-md focus-within:border-gray-500">
                    <Search className="h-5 w-5 text-gray-400 pointer-events-none" />
                    <input type="text" placeholder="Plur 890987645368" onChange={e => setFiltering(e.target.value)} className="outline-none text-sm w-full"/>
                    </div>
                </div>
                <div>
                    {/* <button onClick={()=>handleOpenChange()}  className="py-2 px-2 md:px-4 flex items-center rounded-md bg-gradient-to-r from-blue-500 to-blue-800 text-white">
                        <Plus className="w-4 h-4 mr-2 text-white"/> <span className="text-xs md:text-sm">Add Ticket</span>
                    </button> */}
                </div>
            </div>
            <div className="mt-4">
                <AllCustomer page={page} setPage={setPage} setLimit={setLimit} limit={limit} />
            </div>
        </div>
    )
}

export default Clients
