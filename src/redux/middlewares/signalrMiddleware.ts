import { type Middleware } from '@reduxjs/toolkit';
import * as signalR from '@microsoft/signalr';
import { queryClient } from '../../app/providers/ReactQueryProvider';
import type { InfiniteData } from '@tanstack/react-query';
import type { TicketApiResponse } from '../../entities/tickets/api/ticketApi';
import type { Ticket } from '../../entities/tickets/model/ticket';

// exponential reconnection
const makeDelays = () => [0, 1000, 2000, 4000, 8000, 16000]
    .map(d => d + Math.random() * 300);

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
                    queryClient.invalidateQueries({
                        queryKey: ['tickets'],
                    });
                });

                // Ticket UPDATED
                connection.on('TicketUpdated', (ticket: Ticket) => {
                    queryClient.setQueriesData<InfiniteData<TicketApiResponse>>(
                        { queryKey: ['tickets'] },
                        old => {

                            if (!old) {
                                return old;
                            }

                            return {
                                ...old,
                                pages: old.pages.map(page => ({
                                    ...page,
                                    items: page.items.map(t =>
                                        t.id === ticket.id ? ticket : t
                                    ),
                                })),
                            };
                        }
                    );
                });

                // Ticket DELETED
                connection.on('TicketDeleted', (deletedId: string) => {
                    queryClient.setQueriesData<InfiniteData<TicketApiResponse>>(
                        { queryKey: ['tickets'] },
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

                connection.onreconnecting(() => {
                    // optional: mark stale / show banner
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
                await new Promise(res => setTimeout(res, delay));
            }
        }

        connecting = false;
    };

    start();

    return next => action => next(action);
};