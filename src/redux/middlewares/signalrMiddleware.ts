import { type Middleware } from '@reduxjs/toolkit';
import * as signalR from '@microsoft/signalr';
import { queryClient } from '../../app/providers/ReactQueryProvider';
import type { InfiniteData } from '@tanstack/react-query';
import type { TicketApiResponse } from '../../entities/tickets/api/ticketApi';
import type { Ticket } from '../../entities/tickets/model/ticket';

// exponential reconnection
const makeDelays = () => [0, 1000, 2000, 4000, 8000, 16000]
    .map(d => d + Math.random() * 300);

let invalidateTimeout: number | null;

export const signalrMiddleware: Middleware = () => {
    let connection: signalR.HubConnection | null = null;
    let connecting = false;

    const start = async () => {

        if (connecting) {
            return;
        }

        connecting = true;

        const delays = makeDelays();

        for (const delay of delays) {
            try {
                const hubUrl = import.meta.env.VITE_SOCKET_HUB;

                connection = new signalR.HubConnectionBuilder()
                    .withUrl(hubUrl, { withCredentials: true })
                    .withAutomaticReconnect()
                    .build();

                // Ticket CREATED
                connection.on('TicketCreated', (_: Ticket) => {
                    
                     if (invalidateTimeout) {
                        return;
                     }

                     invalidateTimeout = setTimeout(() => {
                        queryClient.invalidateQueries({
                        queryKey: ['tickets'],
                        refetchType: 'none',
                     })

                     invalidateTimeout = null;
                   }, 1000)
                });

                // Ticket UPDATED
                connection.on('TicketUpdated', (updated: Ticket) => {

                   // TODO: move logic to entity hook
                   queryClient.setQueriesData<InfiniteData<TicketApiResponse>>({ queryKey: ['tickets'] },
                    (old) => {
                       if (!old) {
                         return old
                       }

                       const oldTicket = old.pages
                            .flatMap(f => f.items)
                            .find(t => t.id === updated.id)

                       // If this list never had the ticket, do nothing
                       if (!oldTicket) {
                          return old
                       }

                       // Decide using oldTicket + updated
                       if (
                        oldTicket.status === updated.status &&
                        oldTicket.priority === updated.priority
                       ) {
                       // membership unchanged - replace
                       return {
                         ...old,
                         items: old.pages
                            .flatMap(f => f.items)
                            .map(t => t.id === updated.id ? updated : t),
                       }
                   }

                   // membership changed - remove
                   return {
                     ...old,
                     items: old.pages
                        .flatMap(f => f.items)
                        .filter(t => t.id !== updated.id),
                   }
                 })
               });

                // Ticket DELETED
                connection.on('TicketDeleted', (deletedId: string) => {
                    
                   // TODO: move logic to entity hook
                   queryClient.setQueriesData<InfiniteData<TicketApiResponse>>({ queryKey: ['tickets'] },
                        old => {

                            if (!old) {
                                return old;
                            }

                            return {
                                ...old,
                                pages: old.pages.map(page => ({
                                    ...page,
                                    items: page.items.filter(t => t.id !== deletedId),
                                })),
                            };
                        }
                    );
                });

                connection.onreconnected(() => {
                    // resync after reconnect
                    queryClient.invalidateQueries({
                        queryKey: ['tickets'],
                    });
                });

                await connection.start();
                connecting = false;
                return;
            } catch {
                // wait before retrying
                await new Promise(res => setTimeout(res, delay));
            }
        }

        connecting = false;
    };

    start();

    return next => action => next(action);
};