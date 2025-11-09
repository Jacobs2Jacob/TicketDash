import { type Middleware } from '@reduxjs/toolkit';
import * as signalR from '@microsoft/signalr';
import {  
    ticketAdded,
    ticketDeleted,
    ticketUpdated,
} from '@/redux/slices/ticketSlice';

// exponential reconnection
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
                const hubUrl = import.meta.env.VITE_SOCKET_HUB;

                connection = new signalR.HubConnectionBuilder()
                    .withUrl(hubUrl, { 
                        accessTokenFactory: () => token
                    })
                    .withAutomaticReconnect()
                    .build();

                connection.on('TicketCreated', (ticket) => {
                    store.dispatch(ticketAdded(ticket));
                });

                connection.on('TicketUpdated', (payload) => {
                    const { ...ticket } = payload;
                    console.log(ticket);
                    store.dispatch(
                        ticketUpdated(ticket)
                    );
                });

                connection.on('TicketDeleted', (id: string) => {
                    store.dispatch(ticketDeleted(id));
                });

                connection.onreconnecting(() => {
                    // for caching later
                    //store.dispatch(markTicketsStale());
                });

                connection.onreconnected(() => {
                    // for caching later
                    //store.dispatch(markTicketsStale());
                });

                await connection.start();
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