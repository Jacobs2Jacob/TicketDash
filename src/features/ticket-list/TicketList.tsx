import { useMemo } from 'react';
import { useInfiniteTickets } from '@/hooks/useInfiniteTickets';
import {
    InfiniteTable,
    InfiniteTableRow,
    type Column,
} from '@/components/InfiniteTable';
import { TicketPriority, TicketStatus } from '@/types/ticketTypes';

const TicketList = () => {
    const {
        tickets,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    } = useInfiniteTickets();

    const columns: Column[] = useMemo(() => [
        { key: 'title', label: 'Title', width: '2fr' },
        { key: 'status', label: 'Status', width: '1fr' },
        { key: 'priority', label: 'Priority', width: '1fr' },
        { key: 'updated', label: 'Updated', width: '1fr' },
    ], []);

    if (isLoading) {
        return <p>Loading tickets...</p>;
    } 

    const columnWidth = useMemo(() =>
        columns.map((c) => c.width || '1fr').join(' '),
        []);

    return (
        <InfiniteTable
            columns={columns}
            dataLength={tickets.length}
            hasMore={!!hasNextPage}
            next={fetchNextPage}
            loader={<p>Loading more tickets...</p>}
        >
            {tickets.map((t) => { 
                return <InfiniteTableRow key={t.id} columns={columns} columnTemplate={columnWidth}>
                    {[
                        t.title,
                        TicketStatus[t.status],
                        TicketPriority[t.priority],
                        new Date(t.updatedAt).toLocaleString()
                    ]}
                </InfiniteTableRow>
            }
            )}
            {isFetchingNextPage && <p>Fetching more...</p>}
        </InfiniteTable>
    );
};

export default TicketList;