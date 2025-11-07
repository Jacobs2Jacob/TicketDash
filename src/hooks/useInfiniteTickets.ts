import { useInfiniteQuery } from '@tanstack/react-query';
import { ticketApi } from '@/services/api/ticketApi';
import type { Ticket } from '@/entities/ticket'; 

export const useInfiniteTickets = () => {
    const pageSize = 50;

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
            const totalLoaded = allPages.reduce(
                (sum, page) => sum + page.length,
                0
            );
            return totalLoaded >= lastPage.length ? undefined : allPages.length + 1;
        },
        initialPageParam: 1,
    });

    // Flatten all ticket arrays
    const tickets = data?.pages.flatMap((page) => page) ?? [];

    return {
        tickets,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
    };
};