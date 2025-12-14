import { createSlice, createEntityAdapter, type PayloadAction } from '@reduxjs/toolkit';
import type { Ticket } from '../../entities/tickets/model/ticket';
  
export const ticketsAdapter = createEntityAdapter<Ticket, string>({
    selectId: (t) => t.id,
    sortComparer: (a, b) => b.createdAt.localeCompare(a.createdAt),
});

const initialState = ticketsAdapter.getInitialState({});

const ticketsSlice = createSlice({
    name: 'tickets',
    initialState,
    reducers: {
        ticketsReceived(state, action: PayloadAction<Ticket[]>) {
            ticketsAdapter.setAll(state, action.payload);
        },
        // CREATE
        ticketAdded(state, action: PayloadAction<Ticket>) {
            ticketsAdapter.addOne(state, action.payload);
        },
        // UPDATE
        ticketUpdated(state, action: PayloadAction<Ticket>) {
            ticketsAdapter.setOne(state, action.payload);
        },
        // DELETE
        ticketDeleted(state, action: PayloadAction<string>) {
            ticketsAdapter.removeOne(state, action.payload);
        },
    },
});

export const {
    ticketsReceived,
    ticketAdded,
    ticketUpdated,
    ticketDeleted,
} = ticketsSlice.actions;

export default ticketsSlice.reducer;