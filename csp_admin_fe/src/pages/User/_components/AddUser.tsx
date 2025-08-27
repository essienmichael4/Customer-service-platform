import { useState } from 'react'
import { Dialog, DialogTitle, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTrigger } from '@/components/ui/dialog'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import useAxiosToken from '@/hooks/useAxiosToken'
import { RegisterUserSchema, type RegisterUserSchemaType } from '@/schema/user'
import useAuth from '@/hooks/useAuth'
import RolePicker from './RolePicker'

interface Props{
    trigger?: React.ReactNode,
}

const AddUser = ({trigger}:Props) => {
    const {auth} = useAuth()
    const [open, setOpen] = useState(false)
    const axios_instance_token = useAxiosToken()
    const queryClient = useQueryClient()

    const form = useForm<RegisterUserSchemaType>({
        resolver:zodResolver(RegisterUserSchema),
        defaultValues:{
            name: "",
            email: "",
            role: "USER"
        }
    })

    const handleRoleChange = (value:"ADMIN" | "USER")=>{
        form.setValue("role", value)        
    }

    const addAdmin = async (data:RegisterUserSchemaType)=>{
        const response = await axios_instance_token.post(`/auth/signup`, {
            ...data
        },)

        return response.data
    }

    const {mutate, isPending} = useMutation({
        mutationFn: addAdmin,
        onSuccess: ()=>{
            toast.success("User added successfully", {
                id: "add-admin"
            })

            queryClient.invalidateQueries({queryKey: ["users"]})

            form.reset({
                name: "",
                email: ""
            })

            setOpen(prev => !prev)
        },onError: (err:any) => {
            if (axios.isAxiosError(err)){
                toast.error(err?.response?.data?.message, {
                    id: "add-admin"
                })
            }else{
                toast.error(`Something went wrong`, {
                    id: "add-admin"
                })
            }
        }
    })

    const onSubmit = (data:RegisterUserSchemaType)=>{
        toast.loading("Adding user...", {
            id: "add-admin"
        })
        mutate(data)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className='w-[90%] mx-auto rounded-2xl'>
                <DialogHeader className='items-start'>
                    <DialogTitle>
                        Add User
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form className='space-y-2'>
                            <FormField
                                control={form.control}
                                name="name"
                                render={({field}) =>(
                                    <FormItem className='flex-1'>
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
                        {/* {auth?.role === "ADMIN" && */}
                         <FormField 
                            control={form.control}
                            name="role"
                            render={({}) =>(
                                <FormItem className='flex flex-col'>
                                <FormLabel className='text-xs'>Role</FormLabel>
                                <FormControl>
                                    <RolePicker onChange={handleRoleChange}/>
                                </FormControl>
                                <FormDescription>Select a role</FormDescription>
                            </FormItem>
                            )} 
                        />
                        {/* } */}
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
                        {!isPending && "Add Admin"}
                        {isPending && <Loader2 className='animate-spin' /> }
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default AddUser
