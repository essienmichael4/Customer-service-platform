import DescriptionParser from "@/components/DescriptionParser"
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import useAxiosToken from "@/hooks/useAxiosToken"
import type { Ticket } from "@/lib/types"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import InfoBadge from "./_components/InfoBadge"
import TimelineItem from "./_components/TimelineItem"
import { QuestionMarkCircledIcon } from "@radix-ui/react-icons"
import { ArrowLeft, House, Lightbulb, OctagonAlert, Puzzle } from "lucide-react"

const TicketDetails = () => {
    const {id} = useParams()
    const [comment, setComment] = useState("")
    const navigate = useNavigate()
    const axios_instance_token = useAxiosToken()

    const ticketsQuery = useQuery<Ticket>({
        queryKey: ["tickets", id],
        queryFn: async() => await axios_instance_token.get(`/tickets/${id}`).then(res => {
            return res.data
        }),
        staleTime: 10_000,       // data considered fresh for 10 seconds
        refetchInterval: 10_000, // automatically refetch every 10 seconds
        refetchOnWindowFocus: false, // prevent spammy reloads when switching tabs
    })

    const handleSend = async () => {
        if (!comment.trim()) return;
        
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
            <div className="flex flex-wrap mt-2">
                <div className="w-full md:w-1/2">
                    <div className="flex justify-between items-center mr-2 mb-2">
                        <div className="flex items-center gap-2">
                            <button onClick={()=> navigate(-1)} className="flex gap-2 items-center text-gray-400 hover:text-gray-600 hover:border-gray-600">
                                <ArrowLeft className="w-4 h-4" /> 
                            </button>
                            <div><span className="font-bold text-lg">#{ticketsQuery.data?.id}</span> <span className="py-1 px-2 bg-gray-100 text-xs font-semibold text-gray-600 rounded-md">{ticketsQuery.data?.subject}</span> </div>
                        </div>
                        <div className={`${ticketsQuery.data?.status === "OPEN" && "text-emerald-500 bg-emerald-100"} ${ticketsQuery.data?.status === "CLOSED" && "text-rose-500 bg-rose-100"} ${ticketsQuery.data?.status === "NEW" && "text-cyan-500 bg-cyan-100"} ${ticketsQuery.data?.status === "PENDING" && "text-yellow-500 bg-yellow-100"} ${ticketsQuery.data?.status === "RESOLVED" && "text-purple-500 bg-purple-100"} py-2 px-4 text-xs rounded-full`}>{ticketsQuery.data?.status}</div>
                    </div>
                    <div className="p-2 flex rounded-md border mr-2">
                        <div className="w-1/3 border-r">
                            <div className="px-4 py-2">
                                <h4 className="text-xs mb-2">Ticket Type</h4>
                                <div className={`${ticketsQuery.data?.type.name} py-2 px-2 rounded-md text-xs flex items-center gap-2 bg-gray-200`}>
                                    {ticketsQuery.data?.type.name === "INCIDENT" && <House />}
                                    {ticketsQuery.data?.type.name === "PROBLEM" && <Puzzle />}
                                    {ticketsQuery.data?.type.name === "SUGESTION" && <Lightbulb />}
                                    {ticketsQuery.data?.type.name === "COMPLIANT" && <OctagonAlert />}
                                    {ticketsQuery.data?.type.name === "QUESTION" && <QuestionMarkCircledIcon className="w-3 h-3" />}
                                    {ticketsQuery.data?.type.name}
                                </div>
                            </div>
                        </div>
                        <div className="w-1/3 border-r">
                            <div className="px-4 py-2">
                                <h4 className="text-xs mb-2">Priority</h4>
                                <div 
                                    className={`${ticketsQuery.data?.priority === "LOW" && "bg-emerald-100"} ${ticketsQuery.data?.priority === "NORMAL" && "bg-yellow-100"} ${ticketsQuery.data?.priority === "HIGH" && "bg-orange-100"} ${ticketsQuery.data?.priority === "URGENT" && "bg-rose-100"} flex items-center text-xs gap-2 py-2 px-2 rounded-md`}>
                                        <div className={`${ticketsQuery.data?.priority === "LOW" && "bg-emerald-500"} ${ticketsQuery.data?.priority === "NORMAL" && "bg-yellow-500"} ${ticketsQuery.data?.priority === "HIGH" && "bg-orange-500"} ${ticketsQuery.data?.priority === "URGENT" && "bg-rose-500"} h-2 w-2 rounded-full`}></div>
                                   {ticketsQuery.data?.priority as "LOW" | "NORMAL" | "HIGH" | "URGENT"} 
                                </div>
                            </div>
                        </div>
                        <div className="w-1/3">
                            <div className="px-4 py-2">
                                <h4 className="text-xs mb-2">Assigned to</h4>
                                <p>{ticketsQuery.data?.assignee?.name || "-"}</p>
                            </div>
                        </div>
                    </div>
                    <div className="p-2 flex flex-col">
                        <p className="font-bold text-xs">Message</p>
                        <DescriptionParser description={ticketsQuery.data?.description as string || ''} />
                    </div>
                </div>
                <div className="w-full md:w-1/2">
                    <div className="border-l p-2 flex flex-col">
                        <ScrollArea className="h-96">
                            <h3 className="font-semibold">Conversations & Events</h3>
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

export default TicketDetails
