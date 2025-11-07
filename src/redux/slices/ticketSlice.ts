import { createSlice, createEntityAdapter, type PayloadAction } from '@reduxjs/toolkit';
import type { Ticket } from '@/entities/ticket';

type TicketsState = {
    latestSeenUpdatedAt: string | null;
    pages: Record<number, { fetchedAt: number; ids: string[] }>;
    stale: boolean;
    loading: boolean;
    // optimistic pending mutations: mid -> {id, prev}
    pending: Record<string, { id: string; prev: Ticket }>;
};

export const ticketsAdapter = createEntityAdapter<Ticket, string>({
    selectId: (t: Ticket) => t.id,
    sortComparer: (a, b) => b.updatedAt.localeCompare(a.updatedAt),
});

const initialState = ticketsAdapter.getInitialState<TicketsState>({
    latestSeenUpdatedAt: null,
    pages: {},
    stale: false,
    loading: false,
    pending: {},
});

const ticketsSlice = createSlice({
    name: 'tickets',
    initialState,
    reducers: {
        ticketsPageLoading(state) {
            state.loading = true;
        },
        ticketsPageReceived(
            state,
            action: PayloadAction<{ page: number; tickets: Ticket[]; receivedAt: number }>
        ) {
            const { page, tickets, receivedAt } = action.payload;
            ticketsAdapter.upsertMany(state, tickets);
            state.pages[page] = {
                fetchedAt: receivedAt,
                ids: tickets.map((t) => t.id),
            };
            // update latestSeenUpdatedAt
            for (const t of tickets) {
                if (
                    !state.latestSeenUpdatedAt ||
                    t.updatedAt > state.latestSeenUpdatedAt
                ) {
                    state.latestSeenUpdatedAt = t.updatedAt;
                }
            }
            state.loading = false;
            state.stale = false;
        },
        // optimistic update start
        ticketPatchedOptimistic(
            state,
            action: PayloadAction<{ mid: string; next: Ticket; prev: Ticket }>
        ) {
            const { mid, next, prev } = action.payload;
            ticketsAdapter.upsertOne(state, next);
            state.pending[mid] = { id: next.id, prev };
        },
        // confirmed by HTTP or by SignalR ACK
        ticketPatchedConfirmed(
            state,
            action: PayloadAction<{ mid: string; ticket: Ticket }>
        ) {
            const { mid, ticket } = action.payload;
            ticketsAdapter.upsertOne(state, ticket);
            delete state.pending[mid];
            if (
                !state.latestSeenUpdatedAt ||
                ticket.updatedAt > state.latestSeenUpdatedAt
            ) {
                state.latestSeenUpdatedAt = ticket.updatedAt;
            }
        },
        // server says conflict
        ticketPatchedRollback(state, action: PayloadAction<{ mid: string }>) {
            const { mid } = action.payload;
            const pending = state.pending[mid];
            if (pending) {
                ticketsAdapter.upsertOne(state, pending.prev);
                delete state.pending[mid];
            }
        },
        // realtime events
        ticketCreatedFromHub(state, action: PayloadAction<Ticket>) {
            ticketsAdapter.upsertOne(state, action.payload);
            state.stale = false;
        },
        ticketUpdatedFromHub(
            state,
            action: PayloadAction<{ ticket: Ticket; clientMutationId?: string }>
        ) {
            const { ticket, clientMutationId } = action.payload;
            // If this was our optimistic update, just clear it
            if (clientMutationId && state.pending[clientMutationId]) {
                ticketsAdapter.upsertOne(state, ticket);
                delete state.pending[clientMutationId];
            } else {
                ticketsAdapter.upsertOne(state, ticket);
            }
            if (
                !state.latestSeenUpdatedAt ||
                ticket.updatedAt > state.latestSeenUpdatedAt
            ) {
                state.latestSeenUpdatedAt = ticket.updatedAt;
            }
        },
        ticketDeletedFromHub(state, action: PayloadAction<string>) {
            ticketsAdapter.removeOne(state, action.payload);
        },
        markTicketsStale(state) {
            state.stale = true;
        },
        setTicketsLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },
    },
});

export const {
    ticketsPageLoading,
    ticketsPageReceived,
    ticketPatchedOptimistic,
    ticketPatchedConfirmed,
    ticketPatchedRollback,
    ticketCreatedFromHub,
    ticketUpdatedFromHub,
    ticketDeletedFromHub,
    markTicketsStale,
    setTicketsLoading,
} = ticketsSlice.actions;
  
export default ticketsSlice.reducer;