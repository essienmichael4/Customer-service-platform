import { Button } from '@/components/ui/button'
import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useEffect, useState } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
    onChange: (value: "LOW" | "NORMAL" | "HIGH" | "URGENT")=>void
}

const PriorityPicker = ({onChange}:Props) => {
    const stat:("LOW" | "NORMAL" | "HIGH" | "URGENT")[] = ["LOW", "NORMAL", "HIGH", "URGENT"]
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState<"LOW" | "NORMAL" | "HIGH" | "URGENT">("LOW")

    useEffect(()=>{
        if(!value) return
        onChange(value)
    }, [onChange, value])

    

    const selectedPriority = stat.find((status:"LOW" | "NORMAL" | "HIGH" | "URGENT")=> status === value)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant={"outline"} role='combobox' aria-expanded={open} className='w-full text-xs justify-between'>
                    {selectedPriority ? (
                        <StatusRow status={selectedPriority} />
                    ) : (
                        "Select priority"
                    )}
                    <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50'/>
                </Button>
            </PopoverTrigger>
            <PopoverContent className='w-[200px] p-0'>
                <Command onSubmit={e=> e.preventDefault()}>
                    <CommandInput placeholder='Search category'/>
                    <CommandGroup>
                        <CommandList>
                            {stat.map((status:"LOW" | "NORMAL" | "HIGH" | "URGENT") => {                              
                                    return (
                                        <CommandItem key={status} onSelect={()=>{
                                            setValue(status)
                                            setOpen(prev=>!prev)
                                        }}>
                                        <StatusRow status={status} />
                                        <Check className={cn("mr-2 w-4 h-4 opacity-0", value===status && "opacity-100")} />
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

function StatusRow({status}:{status:"LOW" | "NORMAL" | "HIGH" | "URGENT"}){
    return (
        <div className="flex items-center gap-2 text-xs">
            <div className={`${status === "LOW" && "bg-emerald-500"} ${status === "NORMAL" && "bg-yellow-500"} ${status === "HIGH" && "bg-orange-500"} ${status === "URGENT" && "bg-rose-500"} h-2 w-2 rounded-full`}></div>
            <span>{status}</span>
        </div>
    )
}

export default PriorityPicker
