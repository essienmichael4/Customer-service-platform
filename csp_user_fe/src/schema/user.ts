import { z } from "zod";

export const RegisterUserSchema = z.object({
    name: z.string().min(2, {
        message: "Firstname must be a valid firstname"
    }),
    email: z.string().email({
        message: "Email must be a valid email."
    }),
    role:z.union([
        z.literal("USER"),
        z.literal("ADMIN")
    ])
})

export const UserUpdateSchema = z.object({
    name: z.string().min(2, {
        message: "Firstname must be a valid firstname"
    }),
    email: z.string().email({
        message: "Email must be a valid email."
    })
})

export const UserPasswordUpdateSchema = z.object({
    oldPassword: z.string().min(7, {
        message: "Password must be a more than 8 characters."
    }).max(30).optional(),
    newPassword: z.string().min(7, {
        message: "Password must be a more than 8 characters."
    }).max(30).optional(),
    confirmPassword: z.string().min(7, {
        message: "Password must be a more than 8 characters."
    }).max(30).optional(),
}).superRefine(({ confirmPassword, newPassword }, ctx) => {
    if (confirmPassword !== newPassword) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords did not match",
        path: ['confirmPassword']
      });
    }
  });

  export const AddressSchema = z.object({
    country: z.string({
        message: "Must be a valid country."
    }),
    state: z.string({
        message: "Must be a valid state."
    }).optional().or(z.literal('')),
    city: z.string({
        message: "Must be a valid city."
    }).optional().or(z.literal('')),
    addressLineOne: z.string({
        message: "Must be a valid street address."
    }),
    landmark: z.string({
        message: "Must be a valid landmark."
    }),
})


export const ContactSchema = z.object({
    phone: z.string({
        message: "Must be a valid phone number."
    }),
})

export type AddressSchemaType = z.infer<typeof AddressSchema>
export type ContactSchemaType = z.infer<typeof ContactSchema>

export type UserUpdateSchemaType = z.infer<typeof UserUpdateSchema>
export type UserPasswordUpdateSchemaType = z.infer<typeof UserPasswordUpdateSchema>


export type RegisterUserSchemaType = z.infer<typeof RegisterUserSchema>
