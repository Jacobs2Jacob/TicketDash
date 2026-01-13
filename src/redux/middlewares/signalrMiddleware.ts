import { type Middleware } from '@reduxjs/toolkit';
import * as signalR from '@microsoft/signalr';
import { queryClient } from '../../app/providers/ReactQueryProvider';
import type { Ticket } from '../../entities/tickets/model/ticket';
import { handleTicketUpdated, handleTicketDeleted } from '../../entities/tickets/hooks/useTicketCrud';

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

                // Ticket CREATED - Invalidate cache on creation, 
                // Logic rules may apply and object may be restricted for current user.
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

                // Ticket UPDATED - update in place
                connection.on('TicketUpdated', (updated: Ticket) => {
                    handleTicketUpdated(updated);
                });

                // Ticket DELETED - delete anyway
                connection.on('TicketDeleted', (deletedId: string) => {
                    handleTicketDeleted(deletedId);
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