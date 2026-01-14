import { useMutation } from '@tanstack/react-query';
import { ticketApi } from '../api/ticketApi';
import type { Ticket } from '../model/ticket';
import type { InfiniteData } from '@tanstack/react-query';
import type { TicketApiResponse } from '../api/ticketApi';
import { queryClient } from '../../../app/providers/ReactQueryProvider';

// Helper functions for Socket.io cache updates (can be used outside React components)
export const handleTicketUpdated = (updated: Ticket) => {
    queryClient.setQueriesData<InfiniteData<TicketApiResponse>>(
        { queryKey: ['tickets'] },
        (old) => {
            if (!old) {
                return old;
            }
            
            const oldTicket = old.pages
                .flatMap((f) => f.items)
                .find((t) => t.id === updated.id);

            // If this list never had the ticket, do nothing
            if (!oldTicket) {
                return old;
            }

            // Extract filter state from query key
            const params = new URLSearchParams(window.location.search);

            const status = params.get("status");
            const priority = params.get("priority");

            // Check if this query has active filters (status or priority not null)
            const hasFilters = status || priority;

            // If status/priority changed
            if (
                oldTicket.status !== updated.status ||
                oldTicket.priority !== updated.priority
            ) {
                // Only remove if this query has active filters
                if (hasFilters) {
                    return {
                        ...old,
                        pages: old.pages.map((page) => ({
                            ...page,
                            items: page.items.filter((t) => t.id !== updated.id),
                        })),
                    };
                }
                // No filters - keep it, just update (ticket stays in unfiltered list)
                return {
                    ...old,
                    pages: old.pages.map((page) => ({
                        ...page,
                        items: page.items.map((t) =>
                            t.id === updated.id ? updated : t
                        ),
                    })),
                };
            }

            // Status/priority unchanged - always replace in place
            return {
                ...old,
                pages: old.pages.map((page) => ({
                    ...page,
                    items: page.items.map((t) =>
                        t.id === updated.id ? updated : t
                    ),
                })),
            };
        }
    );
};

export const handleTicketDeleted = (deletedId: string) => {
    queryClient.setQueriesData<InfiniteData<TicketApiResponse>>(
        { queryKey: ['tickets'] },
        (old) => {
            if (!old) {
                return old;
            }

            return {
                ...old,
                pages: old.pages.map((page) => ({
                    ...page,
                    items: page.items.filter((t) => t.id !== deletedId),
                })),
            };
        }
    );
};

export const useTicketCrud = () => {
    const createMutation = useMutation({
        mutationFn: (data: Partial<Ticket>) => ticketApi.createTicket(data),
        // Cache updates handled by Socket.io websocket
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Ticket> }) =>
            ticketApi.updateTicket(id, data),
        // Cache updates handled by Socket.io websocket
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => ticketApi.deleteTicket(id),
        // Cache updates handled by Socket.io websocket
    });

    return {
        createTicket: createMutation.mutateAsync,
        updateTicket: updateMutation.mutateAsync,
        deleteTicket: deleteMutation.mutateAsync,
        isCreating: createMutation.isPending,
        isUpdating: updateMutation.isPending,
        isDeleting: deleteMutation.isPending,
    };
};
