import { useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux'; 
import type { RootState } from '@/redux/store';
import { ticketApi } from '../services/api/ticketApi';
import { selectAllTickets } from '../redux/selectors/ticketSelectors';
import { ticketsPageLoading, ticketsPageReceived } from '../redux/slices/ticketSlice';

export const useInfiniteTickets = () => {
    const dispatch = useDispatch();
    const tickets = useSelector(selectAllTickets);
    const { stale, latestSeenUpdatedAt } = useSelector((s: RootState) => s.tickets);
    const observerRef = useRef<IntersectionObserver | null>(null);

    const fetchPage = useCallback(
        async (page: number) => {

            dispatch(ticketsPageLoading());

            const data = await ticketApi.getTickets({
                page,
                pageSize: 50,
                sort: 'updatedAt_desc',
                sinceUpdatedAt: stale ? latestSeenUpdatedAt ?? undefined : undefined,
            });

            const items = Array.isArray(data) ? data : (data as any).items;

            dispatch(
                ticketsPageReceived({
                    page,
                    tickets: items,
                    receivedAt: Date.now(),
                })
            );
        },
        [dispatch, stale, latestSeenUpdatedAt]
    );

    useEffect(() => {
        fetchPage(1);
    }, [fetchPage]);

    const setLastRef = useCallback(
        (node: HTMLDivElement | null) => {
            if (observerRef.current) observerRef.current.disconnect();
            observerRef.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    const nextPage = Math.floor(tickets.length / 50) + 1;
                    fetchPage(nextPage);
                }
            });
            if (node) observerRef.current.observe(node);
        },
        [fetchPage, tickets.length]
    );

    return { tickets, setLastRef, stale };
};