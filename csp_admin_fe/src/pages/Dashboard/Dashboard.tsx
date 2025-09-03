import HistoryChart from "@/components/HistoryChart/HistoryChart"
import { DateRangePicker } from "@/components/ui/date-range-picker";
import useAxiosToken from "@/hooks/useAxiosToken";
import { useQuery } from "@tanstack/react-query";
import { startOfMonth, subMonths } from "date-fns";
import { PackageCheck, Ticket, Timer } from "lucide-react";
import { useState } from "react";

interface countRequest {
  tickets?: number,
  unresolved?: number,
  resolved?: number,
  time?: number,
}

const Dashboard = () => {
  const [dateRange, setDateRange] = useState<{from: Date, to: Date}>({
    from: startOfMonth(subMonths(new Date(), 2)),
    to: new Date()
  })
  const axios_instance_token = useAxiosToken()

  const statsQuery = useQuery<countRequest>({
      queryKey: ["stats", "admin", dateRange],
      queryFn: async() => await axios_instance_token.get(`/stats/admin-stats`, {
        params: {from: dateRange.from,  to: dateRange.to}
      }).then(res => {
          console.log(res.data);
          
          return res.data
      })
  })
  
  return (
    <div className="lg:container px-4 mx-auto relative text-sm">
      <div className='flex flex-wrap items-center justify-between gap-8 my-4 px-2'>
          <h2 className='text-xl font-semibold'>Dashboard</h2>
          <DateRangePicker
            initialDateFrom={dateRange.from}
            initialDateTo={dateRange.to}
            showCompare={false}
            onUpdate={(values)=>{
              const {from, to} = values.range
              if(!from || !to) return
              setDateRange({from, to})
            }}
          />
        </div>
      <div className="w-full flex flex-wrap">
        <div className='w-full sm:w-1/2 lg:w-1/4 px-2 py-2'>
            <div className="flex gap-4 h-full rounded-md p-6 text-md border border-neutral-300">
                <div className="border border-blue-500 rounded-full p-1 w-6 h-6 items-center flex justify-center bg-blue-400/50">
                    <Ticket className="w-4 h-4 text-blue-500" />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-muted-foreground">Total Tickets</h3>
                    <p className="text-3xl">{statsQuery.data?.tickets}</p>
                </div>
            </div>
        </div>
        <div className='w-full sm:w-1/2 lg:w-1/4 px-2 py-2'>
            <div className="flex gap-4 h-full rounded-md p-6 text-md border border-neutral-300">
                <div className="border border-rose-700 w-6 h-6 items-center flex justify-center rounded-full p-1 bg-rose-400/50">
                    <Ticket className="w-4 h-4 text-rose-700" />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-muted-foreground">Unresolved Tickets</h3>
                    <p className="text-3xl">{statsQuery.data?.unresolved}</p>
                </div>
            </div>
        </div>
        <div className='w-full sm:w-1/2 lg:w-1/4 px-2 py-2'>
            <div className="flex gap-4 h-full rounded-md p-6 text-md border border-neutral-300">
                <div className="border border-emerald-700 rounded-full p-1 w-6 h-6 items-center flex justify-center bg-emerald-400/50">
                    <PackageCheck className="w-4 h-4 text-emerald-700" />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-muted-foreground">Resolved Tickets</h3>
                    <p className="text-3xl">{statsQuery.data?.resolved}</p>
                </div>
            </div>
        </div>
        <div className='w-full sm:w-1/2 lg:w-1/4 px-2 py-2'>
            <div className="flex gap-4 h-full rounded-md p-6 text-md border border-neutral-300">
                <div className="border border-purple-700 rounded-full w-6 h-6 items-center flex justify-center bg-purple-400/50">
                    <Timer className="w-4 h-4 text-purple-700" />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-muted-foreground">Average First Reply Time</h3>
                    <p className="text-3xl">{statsQuery.data?.time || "12:01 min"}</p>
                </div>
            </div>
        </div>
      </div>
      <div className='p-4 bg-white/15 rounded-xl backdrop-blur-sm'>
        <HistoryChart />
      </div>
    </div>
  )
}

export default Dashboard
