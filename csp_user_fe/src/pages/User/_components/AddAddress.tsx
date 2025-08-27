import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import useAxiosToken from '@/hooks/useAxiosToken'
import { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import CityPicker from '@/components/CityPicker'
import CountryPicker from '@/components/CountryPicker'
import StatePicker from '@/components/StatePicker'
import {City, Country, type ICity, type ICountry, type IState, State} from "country-state-city"
import { AddressSchema, type AddressSchemaType } from '@/schema/user'

interface Props {
    id: number| undefined,
    trigger?: React.ReactNode,
}

const AddAddress = ({id, trigger}:Props) => {
    const [open, setOpen] = useState(false)
    const axios_instance_token = useAxiosToken()
    const countryData = Country.getAllCountries()
    const [stateData, setStateData] = useState<IState[]>()
    const [addressLineTwo, setAddressLineTwo] = useState("")
    const [citiesData, setCitiesData] = useState<ICity[]>()

    const [country, setCountry] = useState(countryData[0])
    const [state, setState] = useState<IState | undefined>()
    const [city, setCity] = useState<ICity>()

    useEffect(()=>{
        setState(undefined)
        setCity(undefined)
        form.setValue("state", "")
        form.setValue("city", "")
        country && setStateData(State.getStatesOfCountry(country?.isoCode))
    }, [country])

    useEffect(()=>{
        setCity(undefined)
        form.setValue("city", "")
        state ? setCitiesData(City.getCitiesOfState(country?.isoCode, state!.isoCode)) : setCitiesData(City.getCitiesOfCountry(country?.isoCode))
    }, [state])

    useEffect(()=>{
        stateData && setState(stateData[0])
    }, [stateData])

    useEffect(()=>{
        citiesData && setCity(citiesData[0])
    }, [citiesData])

    const form = useForm({
        resolver: zodResolver(AddressSchema),
        defaultValues:{
            country: "",
            state: "",
            city: "",
            addressLineOne: "",
            landmark: "",
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
        const response = await axios_instance_token.post(`/users/${id}/address`, {
            ...data,
            addressLineTwo
        },)

        return response.data
    }

    const {mutate, isPending} = useMutation({
        mutationFn: addAddress,
        onSuccess: (data)=>{
            toast.success("Address added successfully", {
                id: "add-address"
            })

            form.reset({
                country: data.country,
                state: data.state,
                landmark: data.landmark,
                addressLineOne: data.addressLineOne,
                city: data.city,
            })

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
        toast.loading("Updating store address...", {
            id: "add-address"
        })
        mutate(data)
    }

    return (
        <Card className='w-full md:w-[80%]'>
            <CardHeader >
                <CardTitle className='text-2xl'>Address</CardTitle>
                <CardDescription>Set your default address for shipping and billing.</CardDescription>
            </CardHeader>
            <CardContent  className='w-full'>
            <Form {...form}>
                <form className='md:w-full' onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="flex gap-2 flex-wrap flex-col sm:flex-row">
                        <FormField 
                            control={form.control}
                            name="country"
                            render={({}) =>(
                                <FormItem className='flex flex-1 flex-col mb-2 gap-1'>
                                    <FormLabel className='text-xs lg:text-sm font-semibold'>Country</FormLabel>
                                    <FormControl>
                                        <CountryPicker data={countryData} selected={country} onChange={handleCountryChange}/>
                                    </FormControl>
                                    {/* <FormDescription>National ID card number for identification.</FormDescription> */}
                                </FormItem>
                            )}
                        />

                        <FormField 
                            control={form.control}
                            name="state"
                            render={({}) =>(
                                <FormItem className='flex flex-1 flex-col mb-2 gap-1'>
                                    <FormLabel className='text-xs lg:text-sm font-semibold'>State/Region</FormLabel>
                                    <FormControl>
                                        <StatePicker data={stateData} selected={state} onChange={handleStateChange}/>
                                    </FormControl>
                                    {/* <FormDescription>National ID card number for identification.</FormDescription> */}
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
                                    <FormLabel className='text-xs lg:text-sm font-semibold'>City</FormLabel>
                                    <FormControl>
                                        <CityPicker data={citiesData} selected={city} onChange={handleCityChange} />
                                    </FormControl>
                                    {/* <FormDescription>National ID card number for identification.</FormDescription> */}
                                </FormItem>
                            )}
                        />

                        <FormField 
                            control={form.control}
                            name="addressLineOne"
                            render={({field}) =>(
                                <FormItem className='flex flex-1 flex-col mb-2 gap-1'>
                                <FormLabel className='text-xs lg:text-sm font-semibold'>Address Line One</FormLabel>
                                <FormControl>
                                <Input 
                                    className='px-2 py-3 text-sm rounded border border-gray-200 w-full' 
                                    placeholder='Please enter your street address' {...field} />
                                </FormControl>
                                <FormDescription>Address line or street address of location</FormDescription>
                            </FormItem>
                            )} 
                        />
                    </div>
                    <div className="flex gap-2 flex-wrap flex-col sm:flex-row">
                        <FormField 
                            // control={form.control}
                            name="addressLineTwo"
                            render={({}) =>(
                                <FormItem className='flex flex-1 flex-col mb-2 gap-1'>
                                <FormLabel className='text-xs lg:text-sm font-semibold'>Address Line Two</FormLabel>
                                {/* <FormControl> */}
                                <Input 
                                    className='px-2 py-3 text-sm rounded border border-gray-200 w-full' 
                                    placeholder='Please enter your street address' onChange={e=> setAddressLineTwo(e.target.value)}/>
                                {/* </FormControl> */}
                                <FormDescription>Address line or street address of location</FormDescription>
                            </FormItem>
                            )} 
                        />
                        <FormField 
                            control={form.control}
                            name="landmark"
                            render={({field}) =>(
                                <FormItem className='flex flex-1 flex-col mb-2 gap-1'>
                                    <FormLabel className='text-xs lg:text-sm font-semibold'>Landmark</FormLabel>
                                    <FormControl>
                                        <Input 
                                            className='px-2 py-3 text-sm rounded border border-gray-200 w-full' 
                                            placeholder='Please enter the nearest landmark to your location' {...field} />
                                    </FormControl>
                                    <FormDescription>Nearest landmark.</FormDescription>
                                </FormItem>
                            )}
                        />

                    </div>                        
                </form>
            </Form> 
            <div className="mt-4 flex gap-4">
                <Button onClick={()=>{}} disabled={isPending} className='bg-black/80 text-white'
                    >
                    Back
                </Button>
                <Button onClick={form.handleSubmit(onSubmit)} disabled={isPending} className='bg-gradient-to-r from-blue-500 to-blue-800 text-white'
                >
                    {!isPending && "Add Address"}
                    {isPending && <Loader2 className='animate-spin' /> }
                </Button>
            </div>
            </CardContent>
        </Card>
    )
}

export default AddAddress
