import { axiosClient } from '../../../shared/api/axiosClient';
import { ticketApi } from '../api/ticketApi';
import type { Ticket } from '../model/ticket';
import { TicketPriority, TicketStatus } from '../types/ticketTypes';

// Mock the axios client
jest.mock('../services/api/axiosClient', () => ({
    axiosClient: {
        get: jest.fn(),
        post: jest.fn(),
        patch: jest.fn(),
        delete: jest.fn(),
    },
}));

describe('ticketApi', () => {
    const mockTicket: Ticket = {
        id: '1',
        title: 'Bug in production',
        description: 'Something broke',
        priority: TicketPriority.High,
        status: TicketStatus.Open,
        assigneeId: '123',
        createdAt: '2025-11-09T10:00:00Z',
        updatedAt: '2025-11-09T10:00:00Z',
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    // ---- GET /tickets ----
    it('should fetch tickets with params', async () => {
        (axiosClient.get as jest.Mock).mockResolvedValueOnce({
            data: { items: [mockTicket] },
        });

        const result = await ticketApi.getTickets({ page: 1 });
        expect(axiosClient.get).toHaveBeenCalledWith('/tickets', { params: { page: 1 } });
        expect(result).toEqual([mockTicket]);
    });

    it('should return data if items is undefined', async () => {
        (axiosClient.get as jest.Mock).mockResolvedValueOnce({ data: [mockTicket] });

        const result = await ticketApi.getTickets();
        expect(result).toEqual([mockTicket]);
    });

    // ---- GET /tickets/:id ----
    it('should fetch a ticket by ID', async () => {
        (axiosClient.get as jest.Mock).mockResolvedValueOnce({ data: mockTicket });

        const result = await ticketApi.getTicketById('1');
        expect(axiosClient.get).toHaveBeenCalledWith('/tickets/1');
        expect(result).toEqual(mockTicket);
    });

    // ---- POST /tickets ----
    it('should create a ticket', async () => {
        (axiosClient.post as jest.Mock).mockResolvedValueOnce({ data: mockTicket });

        const result = await ticketApi.createTicket({ title: 'New Ticket' });
        expect(axiosClient.post).toHaveBeenCalledWith('/tickets', { title: 'New Ticket' });
        expect(result).toEqual(mockTicket);
    });

    // ---- PATCH /tickets/:id ----
    it('should update a ticket', async () => {
        const updated = { ...mockTicket, title: 'Updated title' };
        (axiosClient.patch as jest.Mock).mockResolvedValueOnce({ data: updated });

        const result = await ticketApi.updateTicket('1', { title: 'Updated title' });
        expect(axiosClient.patch).toHaveBeenCalledWith('/tickets/1', { title: 'Updated title' });
        expect(result).toEqual(updated);
    });

    // ---- DELETE /tickets/:id ----
    it('should return true when delete returns 204', async () => {
        (axiosClient.delete as jest.Mock).mockResolvedValueOnce({ status: 204 });

        const result = await ticketApi.deleteTicket('1');
        expect(axiosClient.delete).toHaveBeenCalledWith('/tickets/1');
        expect(result).toBe(true);
    });

    it('should return false when delete does not return 204', async () => {
        (axiosClient.delete as jest.Mock).mockResolvedValueOnce({ status: 400 });

        const result = await ticketApi.deleteTicket('1');
        expect(result).toBe(false);
    });

    // ---- Error Handling ----
    it('should propagate axios errors', async () => {
        (axiosClient.get as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

        await expect(ticketApi.getTickets()).rejects.toThrow('Network error');
    });
});