import { axiosClient } from './axiosClient';
import type { Ticket } from '@/entities/ticket';

export interface TicketQueryParams {
    page?: number;
    pageSize?: number;
    status?: string;
    priority?: string; 
    sort?: string;  
    offset?: number;
}; 
 
export const ticketApi = {
      
    getTickets: async (params?: TicketQueryParams) => {
        const res = await axiosClient.get<{ items: Ticket[] }>('/tickets', { params });
        return res.data.items ?? res.data;
    },

    getTicketById: async (id: string) => {
        const res = await axiosClient.get<Ticket>(`/tickets/${id}`);
        return res.data;
    },

    createTicket: async (data: Partial<Ticket>) => {
        const res = await axiosClient.post<Ticket>('/tickets', data);
        return res.data;
    },

    updateTicket: async (
        data: Partial<Ticket>
    ) => {
        const res = await axiosClient.patch<Ticket>(`/tickets`, data);
        return res.data;
    },

    deleteTicket: async (id: string) => {
        const res = await axiosClient.delete(`/tickets/${id}`);
        return res.status === 204;
    },
};