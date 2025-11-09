import { useInfiniteQuery } from '@tanstack/react-query';
import { ticketApi } from '@/services/api/ticketApi';
import type { Ticket } from '@/entities/ticket';
import { useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    selectAllTickets, 
} from '../redux/selectors/ticketSelectors';
import { 
    ticketsReceived,
} from '../redux/slices/ticketSlice';

export const useInfiniteTickets = () => {
    const dispatch = useDispatch();
    const storeTickets = useSelector(selectAllTickets); 
    const pageSize = 30;

    const query = useInfiniteQuery<Ticket[], Error>({
        queryKey: ['tickets'],
        queryFn: async ({ pageParam = 1 }) =>
            await ticketApi.getTickets({
                page: pageParam as number
            }),
        getNextPageParam: (lastPage, allPages) =>
            lastPage.length < pageSize ? undefined : allPages.length + 1,
        initialPageParam: 1,
    });

    useEffect(() => {
        if (query.data) {
            const flat = query.data.pages.flat();
            dispatch(ticketsReceived(flat));
        }
    }, [query.data, dispatch]);

    const tickets = useMemo(() => storeTickets, [storeTickets]);

    return {
        tickets,
        fetchNextPage: query.fetchNextPage,
        hasNextPage: query.hasNextPage,
        isFetchingNextPage: query.isFetchingNextPage,
        isLoading: query.isLoading,
        isError: query.isError,
    };
};