import { createSlice, createEntityAdapter, type PayloadAction } from '@reduxjs/toolkit';
import type { Ticket } from '@/entities/ticket';

type TicketsState = {
    latestSeenUpdatedAt: string | null;
    stale: boolean;
    loading: boolean;
};

export const ticketsAdapter = createEntityAdapter<Ticket, string>({
    selectId: (t) => t.id,
    sortComparer: (a, b) => b.updatedAt.localeCompare(a.updatedAt),
});

const initialState = ticketsAdapter.getInitialState<TicketsState>({
    latestSeenUpdatedAt: null,
    stale: false,
    loading: false,
});

const ticketsSlice = createSlice({
    name: 'tickets',
    initialState,
    reducers: {
        // READ (list)
        ticketsLoading(state) {
            state.loading = true;
        },
        ticketsReceived(state, action: PayloadAction<Ticket[]>) {
            ticketsAdapter.setAll(state, action.payload);

            // update latestSeenUpdatedAt
            for (const t of action.payload) {
                if (!state.latestSeenUpdatedAt || t.updatedAt > state.latestSeenUpdatedAt) {
                    state.latestSeenUpdatedAt = t.updatedAt;
                }
            }
            state.loading = false;
            state.stale = false;
        },

        // CREATE
        ticketAdded(state, action: PayloadAction<Ticket>) {
            ticketsAdapter.addOne(state, action.payload);

            if (
                !state.latestSeenUpdatedAt ||
                action.payload.updatedAt > state.latestSeenUpdatedAt
            ) {
                state.latestSeenUpdatedAt = action.payload.updatedAt;
            }
        },

        // UPDATE
        ticketUpdated(state, action: PayloadAction<Ticket>) {
            ticketsAdapter.setOne(state, action.payload);

            if (
                !state.latestSeenUpdatedAt ||
                action.payload.updatedAt > state.latestSeenUpdatedAt
            ) {
                state.latestSeenUpdatedAt = action.payload.updatedAt;
            }
        },

        // DELETE
        ticketDeleted(state, action: PayloadAction<string>) {
            ticketsAdapter.removeOne(state, action.payload);
        },

        // cache invalidation (used by SignalR middleware)
        markTicketsStale(state) {
            state.stale = true;
        },
    },
});

export const {
    ticketsLoading,
    ticketsReceived,
    ticketAdded,
    ticketUpdated,
    ticketDeleted,
    markTicketsStale,
} = ticketsSlice.actions;

export default ticketsSlice.reducer;