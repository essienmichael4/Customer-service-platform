import { Button } from '@/components/ui/button'
import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { type ICountry } from 'country-state-city'

interface Props {
    data: ICountry[],
    selected: ICountry,
    onChange: (value:ICountry)=>void
}

const CountryPicker = ({data, selected, onChange}:Props) => {
    const [open, setOpen] = useState(false)
    // const [value, setValue] = useState<"TRUE" | "FALSE">("FALSE")
    
    // useEffect(()=>{
    //     if(!value) return
    //     onChange(value)
    // }, [onChange, value])

    const selectedCategory = data.find((country) => selected.name === country.name)
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant={"outline"} role='combobox' aria-expanded={open} className='w-full text-xs justify-between'>
                    {selectedCategory ? (
                        <StatusRow country={selectedCategory} />
                    ) : (
                        "Select country"
                    )}
                    <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50'/>
                </Button>
            </PopoverTrigger>
            <PopoverContent className='w-full p-0'>
                <Command onSubmit={e=> e.preventDefault()}>
                    <CommandInput placeholder='Search country'/>
                    <CommandGroup>
                        <CommandList>
                            {data.map((country) => {
                                    return (
                                        <CommandItem key={country.name} onSelect={()=>{
                                            onChange(country)
                                            setOpen(prev=>!prev)
                                        }}>
                                        <StatusRow country={country} />
                                        <Check className={cn("mr-2 w-4 h-4 opacity-0", country.name===selected.name && "opacity-100")} />
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

function StatusRow({country}:{country:ICountry}){
    return (
        <div className="flex items-center gap-2 text-xs">
            <span>{country.name}</span>
        </div>
    )
}

export default CountryPicker
