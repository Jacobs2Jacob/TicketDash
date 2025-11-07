import { type Middleware } from '@reduxjs/toolkit';
import * as signalR from '@microsoft/signalr';
import {
    ticketCreatedFromHub,
    ticketUpdatedFromHub,
    ticketDeletedFromHub,
    markTicketsStale,
} from '@/redux/slices/ticketSlice';

const makeDelays = () =>
    [0, 1000, 2000, 4000, 8000, 16000]
        .map((d) => d + Math.random() * 300);

export const signalrMiddleware: Middleware = (store) => {
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
                const token = localStorage.getItem('accessToken') ?? '';
                connection = new signalR.HubConnectionBuilder()
                    .withUrl('http://localhost:5000/hubs/tickets', {
                        accessTokenFactory: () => token,
                    })
                    .withAutomaticReconnect()
                    .build();

                connection.on('TicketCreated', (ticket) => {
                    store.dispatch(ticketCreatedFromHub(ticket));
                });

                connection.on('TicketUpdated', (payload) => {
                    const { clientMutationId, ...ticket } = payload;
                    store.dispatch(
                        ticketUpdatedFromHub({
                            ticket,
                            clientMutationId,
                        })
                    );
                });

                connection.on('TicketDeleted', (id: string) => {
                    store.dispatch(ticketDeletedFromHub(id));
                });

                connection.onreconnecting(() => {
                    store.dispatch(markTicketsStale());
                });

                connection.onreconnected(() => {
                    store.dispatch(markTicketsStale());
                });

                //await connection.start();
                connecting = false;
                return;
            } catch (err) {
                await new Promise((res) => setTimeout(res, delay));
            }
        }
        connecting = false;
    };

    // start once
    start();

    return (next) => (action) => next(action);
};