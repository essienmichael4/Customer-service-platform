import { z } from "zod";

export const AddAddressSchema = z.object({
    name: z.string().min(2, {
        message: "Title must be a proper title."
    }),
    contact: z.string().min(2, {
        message: "This must be a proper contact name."
    }),
    mobile: z.string().min(9, {
        message: "This must be a proper phone number."
    }),
    address: z.string().min(2, {
        message: "This must be a proper address."
    })
})

export const EditAddressSchema = z.object({
    name: z.string().min(2, {
        message: "Title must be a proper title."
    }).optional().or(z.literal('')),
    contact: z.string().min(2, {
        message: "This must be a proper contact name."
    }).optional().or(z.literal('')),
    mobile: z.string().min(9, {
        message: "This must be a proper phone number."
    }).optional().or(z.literal('')),
    address: z.string().min(2, {
        message: "This must be a proper address."
    }).optional().or(z.literal(''))
})

export type AddAddressSchemaType = z.infer<typeof AddAddressSchema>
export type EditAddressSchemaType = z.infer<typeof EditAddressSchema>

