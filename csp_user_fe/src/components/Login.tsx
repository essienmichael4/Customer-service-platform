import { Loader2 } from 'lucide-react'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { axios_instance } from '@/api/axios'
import { LoginSchema, type LoginSchemaType } from '@/schema/login'
import useAuth from '@/hooks/useAuth'
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import axios from 'axios'
import { Input } from './ui/input'
import { PasswordInput } from './ui/password-input'

const LoginForm = () => {
    const {dispatch} = useAuth()
    const [isPending, setIsPending] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()
    const from = location.state?.from?.pathname || '/dashboard'
    
    const form = useForm<LoginSchemaType>({
        resolver: zodResolver(LoginSchema),
        defaultValues:{
            email: "",
            password: ""
        }
    })

    const onSubmit = async (data:LoginSchemaType) =>{
        try{
            setIsPending(true)
            toast.loading("Logging in...", {
                id: "login"
            })

            const response = await axios_instance.post("/auth/signin", {
                email: data.email,
                password: data.password
            })            
            
            dispatch({type: "ADD_AUTH", payload: response.data})
            form.reset()
            setIsPending(false)
            toast.success("Login successful", {
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
                <form className='md:w-full xl:w-[80%] mt-8' onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField 
                        control={form.control}
                        name="email"
                        render={({field}) =>(
                            <FormItem className='flex flex-col mb-4'>
                                <FormLabel className='text-xs lg:text-sm font-bold'>Email</FormLabel>
                                <FormControl>
                                    <Input 
                                        className='py-2 px-2 text-sm rounded border border-slate-200 w-full' 
                                        placeholder='Please enter your email' {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <FormField 
                        control={form.control}
                        name="password"
                        render={({field}) =>(
                            <FormItem className='flex flex-col mb-1'>
                                <FormLabel className='text-xs lg:text-sm font-bold'>Password</FormLabel>
                                <FormControl>
                                    <PasswordInput 
                                        className='py-2 px-2 text-sm rounded border border-slate-200 w-full' 
                                        placeholder='Please enter your password'
                                        {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <div className='flex justify-between mt-1 mb-4'>
                        <p className='text-xs 2xl:text-sm text-gray-300 mb-0'>Minimum 8 characters</p>
                        <Link to={'../forgot-password'} className='text-blue-700 text-xs 2xl:text-sm'>forgot password</Link>
                    </div>
                    <button className='rounded-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-800 w-full text-white py-2' disabled={isPending}> 
                        {!isPending && "Login"}
                        {isPending && <Loader2 className='animate-spin' /> }
                    </button>
                    <div className='flex gap-2 mb-3 mt-2'>
                        <p className='text-gray-400 text-xs 2xl:text-sm'>Don't have an account?</p>
                        
                        <Link to={"../register"} state={from} className='text-xs 2xl:text-sm text-blue-700'>Register</Link>
                    </div>
                </form>
            </Form>
        </div>
    )
}

export default LoginForm
