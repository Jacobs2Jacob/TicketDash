import { useCallback, useMemo } from 'react';
import { useInfiniteTickets } from '@/hooks/useInfiniteTickets'; 
import { TicketPriority, TicketStatus } from '@/types/ticketTypes';
import { InfiniteTable, type Column } from '@/components/InfiniteTable/InfiniteTable';
import InfiniteTableRow from '@/components/InfiniteTable/InfiniteTableRow';

interface TicketListProps {
    onUpdate: (id: string) => void;
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
        { key: 'status', label: 'Status', width: '1fr' },
        { key: 'priority', label: 'Priority', width: '1fr' },
        { key: 'created', label: 'Created', width: '1fr' },
        { key: 'update', label: 'Update', width: '0.5fr', styles: { marginLeft: "30px", cursor: 'pointer' } },
        { key: 'delete', label: 'Delete', width: '0.5fr', styles: { marginLeft: "30px", cursor: 'pointer' } },
    ], []);

    const columnWidth = useMemo(() =>
        columns.map((c) => c.width || '1fr').join(' '),
    []);

    const handleColumnClick = useCallback(async (column: Column, rowId: string) => {
        if (column.key === 'update') {
            props.onUpdate(rowId);
        }

        if (column.key === 'delete') {  
            props.onDelete(rowId);
        }
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
                        onColumnClick={handleColumnClick} 
                        rowId={t.id} 
                        key={t.id} 
                        columns={columns} 
                        columnTemplate={columnWidth}>
                    {[
                        t.title,
                        TicketStatus[t.status],
                        TicketPriority[t.priority],
                        new Date(t.createdAt).toLocaleString(),
                        '+',
                        '-'
                    ]}
                </InfiniteTableRow>
            }
            )}
            {isFetchingNextPage && <p>Fetching more...</p>}
        </InfiniteTable>
    );
};

export default TicketList;