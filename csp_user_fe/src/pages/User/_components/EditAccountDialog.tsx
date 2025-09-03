import { useState } from 'react'
import { Dialog, DialogTitle, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTrigger } from '@/components/ui/dialog'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import useAuth from '@/hooks/useAuth'
import { toast } from 'sonner'
import axios from 'axios'
import PhoneInput from 'react-phone-input-2'
import "react-phone-input-2/lib/style.css"
import { Loader2 } from 'lucide-react'
import useAxiosToken from '@/hooks/useAxiosToken'
import { UserUpdateSchema, type UserUpdateSchemaType } from '@/schema/user'
import { type User } from '@/lib/types'

interface Props{
    user:User,
    trigger?: React.ReactNode,
}

const EditAccountDialog = ({user, trigger}:Props) => {
    const {dispatch} = useAuth()
    const axios_instance_token = useAxiosToken()
    const queryClient = useQueryClient()
    const [open, setOpen] = useState(false)
    const [phone, setPhone] = useState("")

    const form = useForm<UserUpdateSchemaType>({
        resolver:zodResolver(UserUpdateSchema),
        defaultValues: user ? {
            name: user.name,
            email: user.email
        } : {
            name: "",
            email: ""
        }
    })

    const updateUser = async (data:UserUpdateSchemaType)=>{
        const response = await axios_instance_token.patch(`/users/${user.id}`, {
            ...data, phone
        },)

        return response.data
    }

    const {mutate, isPending} = useMutation({
        mutationFn: updateUser,
        onSuccess: (data)=>{
            toast.success("Account update successful", {
                id: "user-update"
            })

            dispatch(data)
            queryClient.invalidateQueries({queryKey: ["user", user.id]})
            setOpen(prev => !prev)
        },onError: (err:any) => {
            if (axios.isAxiosError(err)){
                toast.error(err?.response?.data?.massage, {
                    id: "user-update"
                })
            }else{
                toast.error(`Something went wrong`, {
                    id: "user-update"
                })
            }
        }
    })

    const onSubmit = (data:UserUpdateSchemaType)=>{
        toast.loading("upadating account...", {
            id: "user-update"
        })
        mutate(data)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className='w-[90%] mx-auto rounded-2xl'>
                <DialogHeader className='items-start'>
                    <DialogTitle>
                        Edit Account
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form className='space-y-2'>
                        <FormField 
                            control={form.control}
                            name="name"
                            render={({field}) =>(
                                <FormItem>
                                    <FormLabel className='text-xs'>Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                </FormItem>
                            )} 
                        />
                        <FormField 
                            control={form.control}
                            name="email"
                            render={({field}) =>(
                                <FormItem>
                                    <FormLabel className='text-xs'>Email</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                </FormItem>
                            )} 
                        />
                        <FormField 
                            // control={form.control}
                            name="phone"
                            render={({}) =>(
                                <FormItem className='flex flex-1 flex-col mb-4 gap-1'>
                                    <FormLabel className='text-xs font-semibold'>Phone</FormLabel>
                                    <FormControl>
                                        <PhoneInput
                                            country="gh"
                                            value={phone}
                                            onChange={(value)=>setPhone(value)}
                                            // onBlur={()=>form.setValue("phone", phone)}
                                            containerStyle={{
                                                width: "100%",
                                                border: "1 px solid #ebebeb"
                                            }}
                                        />
                                    </FormControl>
                                    <FormDescription>Contact to be reached on.</FormDescription>
                                </FormItem>
                            )}
                        />
                    </form>
                </Form>
                <DialogFooter >
                    <DialogClose asChild>
                        <Button 
                            type='button'
                            variant={"secondary"}
                            onClick={()=>{
                                form.reset()
                            }} >
                                Cancel
                        </Button>
                    </DialogClose>
                    <Button onClick={form.handleSubmit(onSubmit)} disabled={isPending} className='bg-gradient-to-r from-blue-500 to-blue-800 text-white py-2'
                    >
                        {!isPending && "Edit Account"}
                        {isPending && <Loader2 className='animate-spin' /> }
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default EditAccountDialog
