
export class TicketResponseDto {
    id: number;
    subject: string;
    description?: string;
    priority: string;
    status: string
    from: any
    assignee: any
    createdAt: Date
    updatedAt: Date
    firstResponseAt: Date 
    resolvedAt: Date
    department: any
    type: TicketTypeResponseDto
    messages: any

    constructor(partial:Partial<TicketResponseDto>){
        Object.assign(this, partial)
    }
}

export class TicketTypeResponseDto {
    id: number;
    name: string
    description?: string
    createdAt: Date
    updatedAt: Date
}
