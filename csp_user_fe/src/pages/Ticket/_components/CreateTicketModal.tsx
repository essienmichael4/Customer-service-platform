import Tiptap from "@/components/RichTextEditor/Tiptap"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import useAxiosToken from "@/hooks/useAxiosToken"
import { TicketSchema, type TicketSchemaType } from "@/schema/ticket"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Loader2, X } from "lucide-react"
import { useForm } from "react-hook-form"
import TicketTypePicker from "./TicketTypePicker"
import { useState } from "react"
import Tags from "./Tags"
import { toast } from "sonner"
import axios from "axios"

interface Props{
  page: number,
  limit: number,
  open: boolean,
  onOpenChange: ()=>void
}

const CreateTicketModal = ({page, limit, open, onOpenChange}:Props) => {
  const [tag, setTag] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const axios_instance_token = useAxiosToken()
  const queryClient = useQueryClient()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setTag(e.target.value)
  }
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      const newTag = tag.trim()
      if(tags.length > 9) return
  
      if((e.key==="," || e.key === "Enter" || e.key === "Tab") && newTag.length && !tags.includes(newTag)){
          e.preventDefault()
          setTag("")
          setTags(prev => [...prev, newTag])
      }else if(e.key === "Backspace" && !newTag.length && tags.length){
          e.preventDefault()
          const tagsCopy = [...tags]
          const lastTag:string = tagsCopy.pop() || ""
          setTags(tagsCopy)
          setTag(lastTag)
      }
  }
  
  const removeTag = (index:number) =>{
      setTags(prevTags => {
      return prevTags.filter((_, i)=> i != index)
      })
  }

  const form = useForm<TicketSchemaType>({
    resolver:zodResolver(TicketSchema),
    defaultValues: {
      topic: "",
      message: "",
    }
  })

  const addTicket = async (data:TicketSchemaType)=>{
    const response = await axios_instance_token.post(`/tickets`, {
      ...data,
      tags,
    },)

    return response.data
  }

  const {mutate, isPending} = useMutation({
      mutationFn: addTicket,
      onSuccess: ()=>{
          toast.success("Ticket added successfully", {
              id: "add-ticket"
          })

          form.reset({})

          queryClient.invalidateQueries({queryKey: ["tickets", page, limit]})
          onOpenChange()
      },onError: (err:any) => {
          if (axios.isAxiosError(err)){
              toast.error(err?.response?.data?.message, {
                  id: "add-ticket"
              })
          }else{
              toast.error(`Something went wrong`, {
                  id: "add-ticket"
              })
          }
      }
  })

  const onSubmit = (data:TicketSchemaType)=>{
      toast.loading("Adding ticket...", {
          id: "add-ticket"
      })
      mutate(data)
  }
  
  return (
    <div className={`${open ? "flex" : "hidden"} items-center justify-center z-50 absolute inset-0 bg-black/40`}>
      <div className="min-w-[350px] w-[90%]  bg-white rounded-lg">
        <div className="px-8 w-full border-b flex items-center py-4 justify-between rounded-t-lg">
            <h4 className=" font-semibold text-lg">Create New Ticket</h4>
            <button onClick={onOpenChange} className="bg-transparent rounded p-1">
                <X className="w-4 h-4"/>
            </button>
        </div>
        <Form {...form}>
          <div className="flex justify-between px-8">
            <div className="max-w-1/2 px-2 py-4">
              <FormField
                  control={form.control}
                  name="message"
                  render={({field}) =>(
                      <FormItem className='w-full'>
                          <FormLabel className='text-xs'>Message</FormLabel>
                          <FormControl>
                              <Tiptap onChange={field.onChange} />
                          </FormControl>
                      </FormItem>
                  )} 
              />
            </div>
            <div className="w-1/2 py-4 px-2 space-y-2">
              <FormField
                control={form.control}
                name="topic"
                render={({field}) =>(
                  <FormItem className='flex-1'>
                    <FormLabel className='text-xs'>Ticket Topic</FormLabel>
                    <FormControl>
                      <Input {...field} className="py-5"/>
                    </FormControl>
                  </FormItem>
                )} 
              />
              <FormField 
                name="ticketType"
                render={({field}) =>(
                  <FormItem className='flex flex-col gap-1'>
                    <FormLabel className='mt-1 text-xs'>Ticket Type</FormLabel>
                    <FormControl>
                        <TicketTypePicker onChange={field.onChange}/>
                    </FormControl>
                    <FormDescription className='text-xs'>Select a ticket type</FormDescription>
                  </FormItem>
                )} 
              />
              <Tags 
                  handleChange={handleChange} 
                  tag={tag}
                  tags={tags} 
                  handleKeyDown={handleKeyDown}
                  removeTag={removeTag}
              />
            </div>
          </div>
          <div className="px-8 my-4 flex justify-end w-full">
            <button onClick={form.handleSubmit(onSubmit)} className="py-2 px-4 bg-cyan-700 rounded-md text-white">
              {!isPending && "Create ticket"}
              {isPending && <Loader2 className='animate-spin' /> }
            </button>
          </div>
        </Form>
      </div>
    </div>
  )
}

export default CreateTicketModal
