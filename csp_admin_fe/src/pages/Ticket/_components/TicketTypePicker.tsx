import { Button } from '@/components/ui/button'
import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useEffect, useState } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import type { TicketType } from '@/lib/types'
import useAxiosToken from '@/hooks/useAxiosToken'

interface Props {
    onChange: (value: string)=>void,
    defaultValue?: string
}

const TicketTypePicker = ({onChange, defaultValue}:Props) => {
    const axios_instance_token = useAxiosToken()
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState<string>("")

    useEffect(() => {
        if (defaultValue) {
            setValue(defaultValue);
        }
    }, [defaultValue]);

    useEffect(()=>{
        if(!value) return
        onChange(value)
    }, [onChange, value])

    const ticketsTypeQuery =  useQuery<TicketType[]>({
        queryKey: ["tickets", "type"],
        queryFn: async() => await axios_instance_token.get("/tickets/types").then(res => res.data)
    })

    const selectedTicketType = ticketsTypeQuery.data?.find((ticketType:TicketType)=> ticketType.name === value)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant={"outline"} role='combobox' aria-expanded={open} className='w-full text-xs justify-between'>
                    {selectedTicketType ? (
                        <StatusRow ticketType={selectedTicketType.name} />
                    ) : (
                        "Select ticket type"
                    )}
                    <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50'/>
                </Button>
            </PopoverTrigger>
            <PopoverContent className='wi[200px] p-0'>
                <Command onSubmit={e=> e.preventDefault()}>
                    <CommandInput placeholder='Search ticket types'/>
                    <CommandGroup>
                        <CommandList>
                            {ticketsTypeQuery?.data && 
                                ticketsTypeQuery.data.map((ticketType:TicketType) => {
                                    return (
                                        <CommandItem key={ticketType.id} onSelect={()=>{
                                            setValue(ticketType.name)
                                            setOpen(prev=>!prev)
                                        }}>
                                        <StatusRow ticketType={ticketType.name} />
                                        <Check className={cn("mr-2 w-4 h-4 opacity-0", value===ticketType.name && "opacity-100")} />
                                        </CommandItem>
                                    )
                                })}
                        </CommandList>
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    )
}

function StatusRow({ticketType}:{ticketType:string}){
    return (
        <div className="flex items-center gap-2 text-xs">
            {/* <span role='img'>{category.icon}</span> */}
            <span>{ticketType}</span>
        </div>
    )
}

export default TicketTypePicker
