import { Loader2 } from 'lucide-react'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { axios_instance } from '@/api/axios'
import useAuth from '@/hooks/useAuth'
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import axios from 'axios'
import { Input } from './ui/input'
import { PasswordInput } from './ui/password-input'
import { RegisterSchema, type RegisterSchemaType,  } from '@/schema/login'

const RegisterForm = () => {
    const {dispatch} = useAuth()
    const [isPending, setIsPending] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()
    const from = location.state?.from?.pathname || '/dashboard'
    
    const form = useForm<RegisterSchemaType>({
        resolver: zodResolver(RegisterSchema),
        defaultValues:{
            name: "",
            email: "",
            password: "",
            confirmPassword: ""
        }
    })

    const onSubmit = async (data:RegisterSchemaType) =>{
        try{
            setIsPending(true)
            toast.loading("Signing Up...", {
                id: "login"
            })

            const response = await axios_instance.post("/auth/signup", {
                email: data.email,
                password: data.password,
                name: data.name,
                confirmPassword: data.confirmPassword

            })
            
            dispatch({type: "ADD_AUTH", payload: response.data})
            form.reset()
            setIsPending(false)
            toast.success("Register successful", {
                id: "login"
            })            
            
            navigate(from, {replace:true})
            
        }catch(err:any){
            setIsPending(false)
            if (axios.isAxiosError(err)){
                toast.error(err?.response?.data?.message, {
                    id: "login"
                })
            }
        }
    }
    
    return (
        <div>
            <Form {...form}>
                <form className='md:w-full xl:w-[80%] mt-2' onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField 
                        control={form.control}
                        name="name"
                        render={({field}) =>(
                            <FormItem className='flex flex-col gap-0 mb-2'>
                                <FormLabel className='text-xs font-bold'>Name</FormLabel>
                                <FormControl>
                                    <Input 
                                        className='py-1 px-2 text-xs rounded border border-slate-200 w-full' 
                                        placeholder='Please enter your fullname' {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField 
                        control={form.control}
                        name="email"
                        render={({field}) =>(
                            <FormItem className='flex flex-col gap-0 mb-2'>
                                <FormLabel className='text-xs font-bold'>Email</FormLabel>
                                <FormControl>
                                    <Input 
                                        className='py-1 px-2 text-xs rounded border border-slate-200 w-full' 
                                        placeholder='Please enter your email' {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <FormField 
                        control={form.control}
                        name="password"
                        render={({field}) =>(
                            <FormItem className='flex flex-col gap-0 mb-0'>
                                <FormLabel className='text-xs font-bold'>Password</FormLabel>
                                <FormControl>
                                    <PasswordInput 
                                        className='py-1 px-2 text-xs rounded border border-slate-200 w-full' 
                                        placeholder='Please enter your password'
                                        {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <div className='flex justify-between mt-0 mb-2'>
                        <p className='text-xs  text-gray-300 mb-0'>Minimum 8 characters</p>
                    </div>
                    
                    <FormField 
                        control={form.control}
                        name="confirmPassword"
                        render={({field}) =>(
                            <FormItem className='flex flex-col gap-0 mb-3'>
                                <FormLabel className='text-xs font-bold'>Confirm Password</FormLabel>
                                <FormControl>
                                    <PasswordInput 
                                        className='py-2 px-2 text-xs rounded border border-slate-200 w-full' 
                                        placeholder='Please enter your password'
                                        {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <button className='rounded-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-800 w-full text-sm text-white py-2' disabled={isPending}> 
                        {!isPending && "Register"}
                        {isPending && <Loader2 className='animate-spin' /> }
                    </button>
                    <div className='flex gap-2 mb-3 mt-2'>
                        <p className='text-gray-400 text-xs 2xl:text-sm'>Already have an account?
                        </p>
                        
                        <Link to={"../login"} className='text-xs 2xl:text-sm text-blue-700'>Login</Link>
                    </div>
                </form>
            </Form>
        </div>
    )
}

export default RegisterForm
