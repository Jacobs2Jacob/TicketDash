import { useInfiniteQuery } from '@tanstack/react-query';
import { ticketApi } from '@/services/api/ticketApi';
import type { Ticket } from '@/entities/ticket';
import { useMemo } from 'react';

export const useInfiniteTickets = () => {
    const pageSize = 30;

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
    } = useInfiniteQuery<Ticket[], Error>({
        queryKey: ['tickets'],
        queryFn: async ({ pageParam = 1 }) =>
            await ticketApi.getTickets({
                page: pageParam as number,
                pageSize,
                sort: 'updatedAt_desc',
            }),
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.length < pageSize) {
                return undefined;
            }

            return allPages.length + 1;
        },
        initialPageParam: 1,
    });

    const tickets = useMemo(() => {
        return data?.pages.flatMap((page) => page) ?? [];
    }, [data]);

    return {
        tickets,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
    };
};