import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import useAxiosToken from '@/hooks/useAxiosToken'
import { useEffect, useState } from 'react'
import CityPicker from '@/components/CityPicker'
import CountryPicker from '@/components/CountryPicker'
import StatePicker from '@/components/StatePicker'
import {City, Country, type ICity, type ICountry, type IState, State} from "country-state-city"
import { AddressSchema, type AddressSchemaType } from '@/schema/user'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { type Address } from '@/lib/types'

interface Props {
    id: number| undefined,
    addressId: number | undefined,
    trigger?: React.ReactNode,
    address: Address
}

const AddNewAddress = ({id, addressId, trigger, address}:Props) => {
    const [open, setOpen] = useState(false)
    const axios_instance_token = useAxiosToken()
    const queryClient = useQueryClient()
    const countryData = Country.getAllCountries()
    const [stateData, setStateData] = useState<IState[]>()
    const [addressLineTwo, setAddressLineTwo] = useState("")
    const [citiesData, setCitiesData] = useState<ICity[]>()

    const [country, setCountry] = useState(countryData.find(country=>{
        if(country.name === address.country) return country
    }) || countryData[0])
    const [state, setState] = useState<IState | undefined>()
    const [city, setCity] = useState<ICity>()

    useEffect(()=>{
        setState(undefined)
        setCity(undefined)
        form.setValue("state", address?.state || "")
        form.setValue("city", address?.city || "")
        country && setStateData(State.getStatesOfCountry(country?.isoCode))
    }, [country])

    useEffect(()=>{
        setCity(undefined)
        form.setValue("city", address?.city || "")
        state ? setCitiesData(City.getCitiesOfState(country?.isoCode, state!.isoCode)) : setCitiesData(City.getCitiesOfCountry(country?.isoCode))
    }, [state])

    useEffect(()=>{
        stateData && setState(stateData.find(state=>{
            if(state.name === address.state) return state
        }) || stateData[0])
    }, [stateData])

    useEffect(()=>{
        citiesData && setCity(citiesData.find(city=>{
            if(city.name === address.city) return city
        }) || citiesData[0])
    }, [citiesData])

    const form = useForm({
        resolver: zodResolver(AddressSchema),
        defaultValues:{
            country: address?.country || "",
            state: address?.state || "",
            city: address?.city || "",
            addressLineOne: address?.addressLineOne || "",
            landmark: address?.landmark || "",
        }
    })

    const handleCountryChange = (value:ICountry)=>{
        setCountry(value)
        form.setValue("country", value.name)
    }

    const handleStateChange = (value:IState)=>{
        setState(value)
        form.setValue("state", value.name)
    }

    const handleCityChange = (value:ICity)=>{
        setCity(value)
        form.setValue("city", value.name)
    }

    const addAddress = async (data:AddressSchemaType)=>{
        const response = await axios_instance_token.patch(`/users/${id}/address/${addressId}`, {
            ...data,
            addressLineTwo
        },)

        return response.data
    }

    const {mutate, isPending} = useMutation({
        mutationFn: addAddress,
        onSuccess: ()=>{
            toast.success("Address added successfully", {
                id: "add-address"
            })

            queryClient.invalidateQueries({queryKey: ["user", id]})
            setOpen(prev => !prev)
        },onError: (err:any) => {
            if (axios.isAxiosError(err)){
                toast.error(err?.response?.data?.message, {
                    id: "add-address"
                })
            }else{
                toast.error(`Something went wrong`, {
                    id: "add-address"
                })
            }
        }
    })
    
    const onSubmit = async (data:AddressSchemaType) =>{
        toast.loading("Updating address...", {
            id: "add-address"
        })
        mutate(data)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className='w-[90%] mx-auto rounded-2xl'>
                <DialogHeader className='items-start'>
                    <DialogTitle>
                        Edit Address
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form className='md:w-full' onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="flex gap-2 flex-wrap flex-col sm:flex-row">
                            <FormField 
                                control={form.control}
                                name="country"
                                render={({}) =>(
                                    <FormItem className='flex flex-1 flex-col mb-2 gap-1'>
                                        <FormLabel className='text-xs font-semibold'>Country</FormLabel>
                                        <FormControl>
                                            <CountryPicker data={countryData} selected={country} onChange={handleCountryChange}/>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <FormField 
                                control={form.control}
                                name="state"
                                render={({}) =>(
                                    <FormItem className='flex flex-1 flex-col mb-2 gap-1'>
                                        <FormLabel className='text-xs font-semibold'>State/Region</FormLabel>
                                        <FormControl>
                                            <StatePicker data={stateData} selected={state} onChange={handleStateChange}/>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex gap-2 flex-wrap flex-col sm:flex-row">
                            <FormField 
                                control={form.control}
                                name="city"
                                render={({}) =>(
                                    <FormItem className='flex flex-1 flex-col mb-2 gap-1'>
                                        <FormLabel className='text-xs font-semibold'>City</FormLabel>
                                        <FormControl>
                                            <CityPicker data={citiesData} selected={city} onChange={handleCityChange} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <FormField 
                                control={form.control}
                                name="addressLineOne"
                                render={({field}) =>(
                                    <FormItem className='flex flex-1 flex-col mb-2 gap-1'>
                                    <FormLabel className='text-xs font-semibold'>Address Line One</FormLabel>
                                    <FormControl>
                                    <Input 
                                        className='px-2 py-3 text-sm rounded border border-gray-200 w-full' 
                                        placeholder='Please enter your street address' {...field} />
                                    </FormControl>
                                </FormItem>
                                )} 
                            />
                        </div>
                        <div className="flex gap-2 flex-wrap flex-col sm:flex-row">
                            <FormField 
                                name="addressLineTwo"
                                render={({}) =>(
                                    <FormItem className='flex flex-1 flex-col mb-2 gap-1'>
                                    <FormLabel className='text-xs font-semibold'>Address Line Two</FormLabel>
                                    <Input 
                                        className='px-2 py-3 text-sm rounded border border-gray-200 w-full' 
                                        placeholder='Please enter your street address' onChange={e=> setAddressLineTwo(e.target.value)}/>
                                </FormItem>
                                )} 
                            />
                            <FormField 
                                control={form.control}
                                name="landmark"
                                render={({field}) =>(
                                    <FormItem className='flex flex-1 flex-col mb-2 gap-1'>
                                        <FormLabel className='text-xs font-semibold'>Landmark</FormLabel>
                                        <FormControl>
                                            <Input 
                                                className='px-2 py-3 text-sm rounded border border-gray-200 w-full' 
                                                placeholder='Please enter the nearest landmark to your location' {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>                            
                    </form>
                </Form> 
                <DialogFooter >
                    <DialogClose asChild>
                        
                        <Button onClick={()=>{}} disabled={isPending} className='bg-black/80 text-white'
                            >
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button onClick={form.handleSubmit(onSubmit)} disabled={isPending} className='bg-gradient-to-r from-blue-500 to-blue-800 text-white'
                    >
                        {!isPending && "Address"}
                        {isPending && <Loader2 className='animate-spin' /> }
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default AddNewAddress
