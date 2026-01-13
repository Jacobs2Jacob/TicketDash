import { useInfiniteQuery } from '@tanstack/react-query'; 
import { type TicketApiResponse, ticketApi } from '../api/ticketApi';

const PAGE_SIZE = 30;

export const useInfiniteTickets = (filters?: { status?: string; priority?: string }) => {
    
    const query = useInfiniteQuery<TicketApiResponse, Error>({
        queryKey: ['tickets', {
            status: filters?.status ?? null,
            priority: filters?.priority ?? null,
            PAGE_SIZE,
        }],
        queryFn: async ({ pageParam = 1 }) => {
            return await ticketApi.getTickets({
                page: pageParam as number,
                pageSize: PAGE_SIZE,
                status: filters?.status,
                priority: filters?.priority,
            });
        },
        getNextPageParam: (lastPage, allPages) => {
            if (!lastPage.items.length) {
                return undefined;
            }

            const loaded = allPages.reduce(
                (sum, p) => sum + p.items.length,
                0
            );

            return loaded < lastPage.total
                ? allPages.length + 1
                : undefined;
        },
        initialPageParam: 1,
        // Infinite stale time so ws handles updates
        staleTime: Infinity,
        // How long data stays in cache when unused to avoid unbounded memory
        gcTime: 30 * 60 * 1000,
    });
     
    return {
        fetchNextPage: query.fetchNextPage,
        hasNextPage: query.hasNextPage,
        isFetchingNextPage: query.isFetchingNextPage,
        isLoading: query.isLoading,
        isError: query.isError,
        data: query.data?.pages.flatMap(fm => fm.items)
    };
};