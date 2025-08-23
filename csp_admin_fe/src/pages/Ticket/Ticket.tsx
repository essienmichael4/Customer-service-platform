import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb"
import useAxiosToken from "@/hooks/useAxiosToken"
import { useQuery } from "@tanstack/react-query"
import { ArrowLeft } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import EditStatusDropdown, { TicketStatus } from "./_components/EditStatusDropdown"
import type { Ticket } from "@/lib/types"
import { Separator } from "@/components/ui/separator"
import PriorityDropdown from "./_components/PriorityDropdown"
import TicketTypeDropdown from "./_components/TicketTypeDropdown"
import DescriptionParser from "../../components/DescriptionParser"
import { ScrollArea } from "@/components/ui/scroll-area"
import InfoBadge from "./_components/InfoBadge"
import { useState } from "react"
import TimelineItem from "./_components/TimelineItem"

const Ticket = () => {
    const {id} = useParams()
    const [comment, setComment] = useState("")
    const navigate = useNavigate()
    const axios_instance_token = useAxiosToken()
    // const queryClient = useQueryClient()

    const ticketsQuery = useQuery<Ticket>({
        queryKey: ["tickets", id],
        queryFn: async() => await axios_instance_token.get(`/tickets/${id}`).then(res => {
            console.log(res.data);
            
            return res.data
        })
    })

    const handleSend = async () => {
        if (!comment.trim()) return;

        console.log(comment);
        
        await axios_instance_token.post(`/tickets/${id}/messages`, {
            text: comment,
            kind: "PUBLIC", // or "INTERNAL"
            authorType: "ADMIN", // or "CUSTOMER"
        });

        setComment("");
        ticketsQuery.refetch(); // reload timeline
    };
    
    const timelineEvents = ticketsQuery.data
        ? [
            ...(ticketsQuery.data.messages ?? []).map((m) => ({
            id: m.id,
            type: "MESSAGE" as const,
            author: { name: m.author?.name ?? "System", role: m.authorType },
            body: m.body,
            createdAt: m.createdAt,
            })),
            ...(ticketsQuery.data.logs ?? []).map((l) => ({
            action: l.action,
            id: l.id,
            type: "LOG" as const,
            details: l.details,
            createdAt: l.createdAt,
            })),
        ].sort(
            (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        )
        : [];

        console.log(timelineEvents);
        
    return (
        <div className="container px-4 mx-auto">
            <Breadcrumb className="mt-1">
                <BreadcrumbList>
                    <BreadcrumbItem>
                    <BreadcrumbLink href="../tickets" className="text-xs">Tickets</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="text-xs"/>
                    <BreadcrumbItem>
                    <BreadcrumbPage className="text-xs">{id}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div className="mt-1 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <button onClick={()=> navigate(-1)} className="flex gap-2 items-center text-gray-400 hover:text-gray-600 hover:border-gray-600">
                        <ArrowLeft className="w-4 h-4" /> <span>Ticket List</span>
                    </button>
                </div>
                <div><span className="font-bold text-lg">#{ticketsQuery.data?.id}</span> <span className="py-1 px-2 bg-gray-100 text-xs font-semibold text-gray-600 rounded-md">{ticketsQuery.data?.subject}</span> </div>
                <div>
                    {ticketsQuery.data?.status === "CLOSED" ? <span className="bg-rose-200 text-rose-700 py-2px-4">{ticketsQuery.data.status}</span> : <EditStatusDropdown id={Number(ticketsQuery.data?.id)} defaultStatus={ticketsQuery.data?.status as TicketStatus} />}
                </div>
            </div>
            <Separator className="my-2" />
            <div className="flex">
                <div className="w-1/2">
                    <div className="p-2 flex">
                        <div className="w-1/3 border-r">
                            <div className="px-4 py-2">
                                <h4 className="text-xs">Ticket Type</h4>
                                <TicketTypeDropdown id={Number(id)} defaultValue={ticketsQuery.data?.type.name} />
                            </div>
                        </div>
                        <div className="w-1/3 border-r">
                            <div className="px-4 py-2">
                                <h4 className="text-xs">Priority</h4>
                                <PriorityDropdown id={Number(id)} defaultValue={ticketsQuery.data?.priority as "LOW" | "NORMAL" | "HIGH" | "URGENT"} />
                            </div>
                        </div>
                        <div className="w-1/3">
                            <div className="px-4 py-2">
                                <h4 className="text-xs">Assigned to</h4>
                                <p>{ticketsQuery.data?.assignee?.name || "-"}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-1/2 border-l">
                    <div className="ml-4 p-2">
                        <div className="flex items-center gap-2">
                            <div className="w-16 h-16 bg-gray-200 rounded-full">

                            </div>
                            <div>
                                <p className="text-2lx font-bold">{ticketsQuery.data?.from.name}</p>
                                <p className="text-xs">{ticketsQuery.data?.from.email}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Separator className="my-2" />
            <div className="flex">
                <div className="w-1/2">
                    <div className="p-2 flex flex-col">
                        <p className="font-bold text-xs">Message</p>
                        <DescriptionParser description={ticketsQuery.data?.description as string || ''} />
                    </div>
                </div>
                <div className="w-1/2">
                    <div className="border-l p-2 flex flex-col">
                        <ScrollArea className="h-64">
                            {/* <div className="flex items-center gap-2">
                                <div className="w-6 h-6 flex items-center justify-center bg-cyan-700 rounded-full">
                                    <TicketIcon className="w-3 h-3 text-white" /> 
                                </div>
                                <p className="text-xs text-gray-400">Ticket Created</p>
                                <p className="text-xs text-gray-600">. {new Date(ticketsQuery.data?.createdAt as string).toLocaleTimeString()}</p>
                            </div>
                            <div className="flex w-[70%] mt-2 gap-2">
                                <div className="w-6 h-6 rounded-full bg-amber-600">

                                </div>
                                <div className="flex flex-1 flex-col">
                                    <div className="flex items-center">
                                        <p className="text-xs text-gray-800 font-semibold">From</p>
                                        <p className="text-xs text-gray-500">. {new Date(ticketsQuery.data?.createdAt as string).toLocaleTimeString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-xs">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo atque iste illo odit ipsam porro ad error optio assumenda expedita.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="ml-auto w-[70%] flex mt-2 gap-2">
                                <div className="flex flex-1 flex-col">
                                    <div className="flex items-center">
                                        <p className="text-xs text-gray-800 font-semibold">Assignee</p>
                                        <p className="text-xs text-gray-500">. {new Date(ticketsQuery.data?.createdAt as string).toLocaleTimeString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-xs">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo atque iste illo odit ipsam porro ad error optio assumenda expedita.</p>
                                    </div>
                                </div>
                                <div className="w-6 h-6 rounded-full bg-amber-600">

                                </div>
                            </div> */}
                            {timelineEvents.map(event => (
                                <TimelineItem key={`${event.type}-${event.id}`} event={event} />
                            ))}
                        </ScrollArea>
                        <div className="w-full mt-4 flex flex-col gap-2 px-2 py-2 border rounded-lg">
                            <div className="flex items-center gap-4">
                            <InfoBadge label="Via" value="Whatsapp" />
                            <InfoBadge label="From" value={ticketsQuery.data?.from.name || ""} />
                            </div>
                            <textarea
                                placeholder="Comment"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSend();
                                    }
                                }}
                                className="p-2 w-full resize-none min-h-10 max-h-32 overflow-y-auto rounded-md outline-0 text-sm"
                            />
                            <button
                                disabled={!comment.trim()}
                                onClick={handleSend}
                                className="ml-auto py-2 px-4 text-xs bg-gray-800 text-gray-100 rounded-lg disabled:opacity-50"
                                >
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Ticket
