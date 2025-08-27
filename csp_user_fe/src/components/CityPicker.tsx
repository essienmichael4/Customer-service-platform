import { Button } from '@/components/ui/button'
import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { type ICity } from 'country-state-city'

interface Props {
    data: ICity[] | undefined,
    selected: ICity | undefined,
    onChange: (value:ICity)=>void
}

const CityPicker = ({data, selected, onChange}:Props) => {
    const [open, setOpen] = useState(false)

    const selectedCategory = data?.find((city)=> city.name === selected?.name)
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant={"outline"} role='combobox' aria-expanded={open} className='w-full text-xs justify-between'>
                    {selectedCategory ? (
                        <StatusRow city={selectedCategory} />
                    ) : (
                        "Select city"
                    )}
                    <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50'/>
                </Button>
            </PopoverTrigger>
            <PopoverContent className='w-full p-0'>
                <Command onSubmit={e=> e.preventDefault()}>
                    <CommandInput placeholder='Search city'/>
                    <CommandGroup>
                        <CommandList>
                            {data?.map((city:ICity) => {
                                    return (
                                        <CommandItem key={city.name} onSelect={()=>{
                                            onChange(city)
                                            setOpen(prev=>!prev)
                                        }}>
                                        <StatusRow city={city} />
                                        <Check className={cn("mr-2 w-4 h-4 opacity-0", city.name===selected?.name && "opacity-100")} />
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

function StatusRow({city}:{city:ICity}){
    return (
        <div className="flex items-center gap-2 text-xs">
            <span>{city.name}</span>
        </div>
    )
}

export default CityPicker
