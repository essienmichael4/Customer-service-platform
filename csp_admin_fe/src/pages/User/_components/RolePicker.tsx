'use client'

import { Button } from '@/components/ui/button'
import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useEffect, useState } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
    onChange: (value: "ADMIN" | "USER")=>void
}

const RolePicker = ({onChange}:Props) => {
    const stat:("ADMIN" | "USER")[] = ["ADMIN", "USER"]
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState<"ADMIN" | "USER">("USER")

    useEffect(()=>{
        if(!value) return
        onChange(value)
    }, [onChange, value])

    

    const selectedCategory = stat.find((status:"ADMIN" | "USER")=> status === value)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant={"outline"} role='combobox' aria-expanded={open} className='w-full text-xs justify-between'>
                    {selectedCategory ? (
                        <StatusRow status={selectedCategory} />
                    ) : (
                        "Select role"
                    )}
                    <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50'/>
                </Button>
            </PopoverTrigger>
            <PopoverContent className='wi[200px] p-0'>
                <Command onSubmit={e=> e.preventDefault()}>
                    <CommandInput placeholder='Search role'/>
                    <CommandGroup>
                        <CommandList>
                            {stat.map((status:"ADMIN" | "USER") => {                              
                                    // console.log(categoriesQuery.data)
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

function StatusRow({status}:{status:"ADMIN" | "USER"}){
    return (
        <div className="flex items-center gap-2 text-xs">
            {/* <span role='img'>{category.icon}</span> */}
            <span>{status}</span>
        </div>
    )
}

export default RolePicker
