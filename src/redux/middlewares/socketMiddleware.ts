import { type Middleware } from '@reduxjs/toolkit';
import { io, type Socket } from 'socket.io-client';
import { queryClient } from '../../app/providers/ReactQueryProvider';
import type { Ticket } from '../../entities/tickets/model/ticket';
import { handleTicketUpdated, handleTicketDeleted } from '../../entities/tickets/hooks/useTicketCrud';

const createSocket = (hubUrl: string) =>
    io(hubUrl, {
        autoConnect: false,
        withCredentials: true,
        transports: ['websocket'],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 16000,
        randomizationFactor: 0.3,
    });

let invalidateTimeout: ReturnType<typeof setTimeout> | null = null;

export const socketMiddleware: Middleware = () => {
    let socket: Socket | null = null;

    const ensureSocket = () => {
        if (socket) {
            return socket;
        }

        const hubUrl = import.meta.env.VITE_TICKET_API_URL;

        if (!hubUrl) {
            return null;
        }

        socket = createSocket(hubUrl);

        socket.on('ticket:created', (_: Ticket) => {
            if (invalidateTimeout) {
                return;
            }

            invalidateTimeout = setTimeout(() => {
                queryClient.invalidateQueries({
                    queryKey: ['tickets'],
                    refetchType: 'none',
                });
                invalidateTimeout = null;
            }, 1000);
        });

        socket.on('ticket:updated', (updated: Ticket) => { 
            handleTicketUpdated(updated);
        });

        socket.on('ticket:deleted', (deletedId: string) => {
            handleTicketDeleted(deletedId);
        });

        socket.on('reconnect', () => {
            // resync after reconnect
            queryClient.invalidateQueries({
                queryKey: ['tickets'],
            });
        });

        if (!socket.connected) {
            socket.connect();
        }

        return socket;
    };

    ensureSocket();

    return next => action => next(action);
};
