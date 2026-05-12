import { io, type Socket } from 'socket.io-client';
import type { QueryClient } from '@tanstack/react-query';
import type { Ticket } from '../../../entities/tickets/model/ticket';
import {
  handleTicketUpdated,
  handleTicketDeleted,
} from '../../../entities/tickets/hooks/useTicketCrud';

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

export function initTicketsSocketSync(queryClient: QueryClient) {
  const hubUrl = import.meta.env.VITE_TICKET_API_URL;

  if (!hubUrl) {
    return;
  }

  let invalidateTimeout: ReturnType<typeof setTimeout> | null = null;
  const socket: Socket = createSocket(hubUrl);

  socket.on('ticket:created', (_: Ticket) => {
    if (invalidateTimeout) {
      return;
    }
    
    // invalidate query to avoid in-filter ui glitches
    invalidateTimeout = setTimeout(() => {
      queryClient.invalidateQueries({
        queryKey: ['tickets'],
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
    queryClient.invalidateQueries({
      queryKey: ['tickets'],
    });
  });

  socket.connect();

  return () => {
    if (invalidateTimeout) {
      clearTimeout(invalidateTimeout);
      invalidateTimeout = null;
    }

    socket.removeAllListeners();
    socket.disconnect();
  };
}