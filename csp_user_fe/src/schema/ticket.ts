import { z } from "zod";

export const TicketSchema = z.object({
    message: z.string().min(2, {
        message: "Message cannot be empty."
    }),
    topic: z.string().min(2, {
        message: "Ticket topic cannot be empty."
    }).max(60),
    ticketType: z.string({
        message: "Ticket type cannot be empty."
    })
})

export type TicketSchemaType = z.infer<typeof TicketSchema>
