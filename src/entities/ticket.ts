import type { TicketPriority, TicketStatus } from "@/types/ticketTypes";
 
export interface Ticket {
    id: string;
    title: string;
    description: string;
    priority: TicketPriority;
    status: TicketStatus;
    assigneeId?: string | null;
    createdAt: string;
    updatedAt: string;
    version: number;
};