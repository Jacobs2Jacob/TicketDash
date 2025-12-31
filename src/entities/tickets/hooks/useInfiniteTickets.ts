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
        getNextPageParam: (_, allPages) => {
            return allPages.flatMap(f => f.items).length <
                (allPages[0]?.total ?? 0)
                ? allPages.length + 1
                : undefined;
        },
        initialPageParam: 1,
        // Infinite stale time so ws handles updates
        staleTime: Infinity,
        gcTime: 30 * 60 * 1000,
        // force refetch on window focus
        refetchOnWindowFocus: true,
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