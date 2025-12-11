import { axiosClient } from "../../../shared/api/axiosClient";
import type { Ticket } from "../model/ticket";

export interface TicketQueryParams {
    page?: number;
    pageSize?: number;
    status?: string;
    priority?: string; 
    sort?: string;  
    offset?: number;
}; 

export interface TicketApiResponse {
    items: Ticket[];
    page: number;
    pageSize: number;
    total: number;
};

export const ticketApi = {

    getTickets: async (params?: TicketQueryParams): Promise<TicketApiResponse> => {
        const res = await axiosClient.get<TicketApiResponse>('/tickets', { params });
        return res.data;
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
        id: string,
        data: Partial<Ticket>
    ) => {
        const res = await axiosClient.patch<Ticket>(`/tickets/${id}`, data);
        return res.data;
    }, 
    deleteTicket: async (id: string) => {
        const res = await axiosClient.delete(`/tickets/${id}`);
        return res.status === 204;
    },
};