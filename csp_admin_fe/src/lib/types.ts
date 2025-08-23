import type { Dispatch } from "react"

interface Action {
    type: "ADD_AUTH" | "REMOVE_AUTH",
    payload?: AuthType
}

export type AuthType = {
    name: string,
    email: string,
    role?: string,
    id: number | undefined,
    backendTokens: {
        accessToken: string,
        refreshToken: string
    }
}

export type AuthContextType = {
    auth: AuthType | undefined,
    dispatch: Dispatch<Action>;
}

export type Data = {
    data: Ticket[],
    meta: Meta
}

export type Meta = {
    page: number
    take: number
    itemCount: number
    pageCount: number
    hasPreviousPage: boolean
    hasNextPage: boolean
}

export type Message = {
    id: number,
    author: User,
    authorType: string,
    kind: string,
    body: string,
    createdAt: string
}

export type TicketLog = {
    id: number,
    action: string,
    details: string,
    actor: User,
    createdAt: string
}

export type Ticket = {
    id: number,
    subject: string,
    description: string,
    priority: string,
    createdAt: string,
    firstResponseAt: string,
    type: TicketType,
    from: User,
    assignee: User,
    status: string,
    messages: Message[],
    logs: TicketLog[]
}

export type TicketType = {
    id: number,
    name: string
}

export type User = {
    id: number | null,
    name: string,
    email: string,
    phone?: string,
    role?: string,
    createdAt?: string,
    updatedAt?:string,
}
