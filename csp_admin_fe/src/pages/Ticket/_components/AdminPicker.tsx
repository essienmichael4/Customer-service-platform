import { Button } from '@/components/ui/button'
import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useEffect, useState } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import { axios_instance_token } from '@/api/axios'
import type { User } from '@/lib/types'

interface Props {
    onChange: (value: number)=>void,
    defaultValue?: number
}

const AdminPicker = ({onChange, defaultValue}:Props) => {
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState<number | null>()

    useEffect(() => {
        if (defaultValue) {
            setValue(defaultValue);
        }
    }, [defaultValue]);

    useEffect(()=>{
        if(!value) return
        onChange(value)
    }, [onChange, value])

    const adminsQuery =  useQuery<User[]>({
        queryKey: ["users", "admins"],
        queryFn: async() => await axios_instance_token.get("/users/admins").then(res => res.data)
    })

    const selecteduser = adminsQuery.data?.find((user:User)=> user.id === value)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant={"outline"} role='combobox' aria-expanded={open} className='w-full text-xs justify-between'>
                    {selecteduser ? (
                        <StatusRow username={selecteduser.name} />
                    ) : (
                        "Select assignee"
                    )}
                    <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50'/>
                </Button>
            </PopoverTrigger>
            <PopoverContent className='w-[300px] p-0'>
                <Command onSubmit={e=> e.preventDefault()}>
                    <CommandInput placeholder='Search admins'/>
                    <CommandGroup>
                        <CommandList>
                            {adminsQuery?.data && 
                                adminsQuery.data.map((user:User) => {
                                    return (
                                        <CommandItem key={user.id} onSelect={()=>{
                                            setValue(user.id)
                                            setOpen(prev=>!prev)
                                        }}>
                                        <StatusRow username={user.name} />
                                        <Check className={cn("mr-2 w-4 h-4 opacity-0", value===user.id && "opacity-100")} />
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

function StatusRow({username}:{username:string}){
    return (
        <div className="flex items-center gap-2 text-xs">
            {/* <span role='img'>{category.icon}</span> */}
            <span>{username}</span>
        </div>
    )
}

export default AdminPicker
