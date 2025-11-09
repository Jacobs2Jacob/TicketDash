import { type RootState } from '@/redux/store';
import { ticketsAdapter } from '@/redux/slices/ticketSlice';

const selectors = ticketsAdapter.getSelectors<RootState>((state: any) => state.tickets);

export const selectAllTickets = selectors.selectAll;
export const selectTicketById = selectors.selectById;
export const selectTicketIds = selectors.selectIds;
export const selectTicketsEntities = selectors.selectEntities; 