import { useCallback, useMemo } from 'react';
import { useInfiniteTickets } from '@/hooks/useInfiniteTickets'; 
import { TicketPriority, TicketStatus } from '@/types/ticketTypes';
import { InfiniteTable, type Column } from '@/components/InfiniteTable/InfiniteTable';
import InfiniteTableRow from '@/components/InfiniteTable/InfiniteTableRow';
import type { Ticket } from '../../entities/ticket';

interface TicketListProps {
    onUpdate: (ticket: Ticket) => void;
    onDelete: (id: string) => void;
}

const TicketList = (props: TicketListProps) => {
    const {
        tickets,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    } = useInfiniteTickets();

    const columns: Column[] = useMemo(() => [
        { key: 'title', label: 'Title', width: '2fr' },
        { key: 'status', label: 'Status', width: '0.5fr' },
        { key: 'priority', label: 'Priority', width: '1fr' },
        { key: 'created', label: 'Created', width: '1fr' },
        { key: 'delete', label: 'Delete', width: '0.5fr', styles: { marginLeft: "30px", cursor: 'pointer' } },
    ], []);

    const columnWidth = useMemo(() =>
        columns.map((c) => c.width || '1fr').join(' '),
    []);

    const handeleTicketDelete = useCallback(async (id: string) => {
        props.onDelete(id);
    }, [])

    const handeleTicketUpdate = useCallback(async (ticket: Ticket) => {
        props.onUpdate(ticket);
    }, [])
     
    if (isLoading) {
        return <p>Loading tickets...</p>;
    } 
     
    return (
        <InfiniteTable
            columns={columns}
            dataLength={tickets.length}
            hasMore={!!hasNextPage}
            next={fetchNextPage}
            loader={<p>Loading more tickets...</p>}
        >
            {tickets.map((t) => {
                return <InfiniteTableRow 
                        rowId={t.id} 
                        key={t.id} 
                        columns={columns} 
                        columnTemplate={columnWidth}>
                    {[
                        t.title,
                        <select
                            value={t.status}
                            onChange={(e) => handeleTicketUpdate({ ...t, status: Number(e.target.value) })}>
                            <option value={TicketStatus.Open}>Open</option>
                            <option value={TicketStatus.InProgress}>In Progress</option>
                            <option value={TicketStatus.Resolved}>Resolved</option>
                        </select>,
                        TicketPriority[t.priority],
                        new Date(t.createdAt).toLocaleString(),
                        <span onClick={() => handeleTicketDelete(t.id)}>-</span>
                    ]}
                </InfiniteTableRow>
            }
            )}
            {isFetchingNextPage && <p>Fetching more...</p>}
        </InfiniteTable>
    );
};

export default TicketList;