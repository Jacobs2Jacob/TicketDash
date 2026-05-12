import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { initTicketsSocketSync } from '@/ws/entities/tickets/ticketWs';

export function TicketsSocketProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();

  useEffect(() => {
    return initTicketsSocketSync(queryClient);
  }, [queryClient]);

  return children;
}