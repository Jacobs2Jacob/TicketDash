import { useInfiniteQuery } from '@tanstack/react-query'; 
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';   
import { ticketsReceived } from '@/redux/slices/ticketSlice';
import { type TicketApiResponse, ticketApi } from '../api/ticketApi';

export const useInfiniteTickets = (filters?: { status?: string; priority?: string }) => {
    const dispatch = useDispatch();
    const pageSize = 30;

    const query = useInfiniteQuery<TicketApiResponse, Error>({
        queryKey: ['tickets', {
            status: filters?.status ?? null,
            priority: filters?.priority ?? null,
            pageSize,
        }],
        queryFn: async ({ pageParam = 1 }) => {
            return ticketApi.getTickets({
                page: pageParam as number,
                pageSize,
                status: filters?.status,
                priority: filters?.priority,
            });
        },
        getNextPageParam: (_, allPages) => {
            return allPages.flatMap(f => f.items).length <
                (allPages[0]?.total ?? 0)
                ? allPages.length + 1
                : undefined;
        },
        initialPageParam: 1,
    });

    useEffect(() => {
        if (query.data) {
            const flat = query.data.pages.flatMap(fm => fm.items); 
            dispatch(ticketsReceived(flat));
        }
    }, [query.data, dispatch]);

    return {
        fetchNextPage: query.fetchNextPage,
        hasNextPage: query.hasNextPage,
        isFetchingNextPage: query.isFetchingNextPage,
        isLoading: query.isLoading,
        isError: query.isError,
        refetch: query.refetch
    };
};