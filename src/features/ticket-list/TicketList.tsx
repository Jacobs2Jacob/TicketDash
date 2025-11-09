import { useCallback, useMemo } from 'react';
import { useInfiniteTickets } from '@/hooks/useInfiniteTickets'; 
import { TicketPriority, TicketStatus } from '@/types/ticketTypes';
import { InfiniteTable, type Column } from '@/components/InfiniteTable/InfiniteTable';
import InfiniteTableRow from '@/components/InfiniteTable/InfiniteTableRow';
import type { Ticket } from '../../entities/ticket';
import type { Agent } from '../../entities/agent';
import { TrashIcon } from "@/components/Icons/icons";
import { useViewport } from '../../hooks/useViewport';
import InfiniteTableRowMobile from '../../components/InfiniteTable/InfiniteTableRowMobile';

interface TicketListProps {
    onUpdate: (ticket: Ticket) => void;
    onDelete: (id: string) => void;
    agents: Agent[]
}

const TicketList = (props: TicketListProps) => {

    const viewport = useViewport();

    const {
        tickets,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    } = useInfiniteTickets();

    const columns: Column[] = useMemo(() => [
        { key: 'title', label: 'Title', width: '1fr' },
        { key: 'status', label: 'Status', width: '0.5fr' },
        { key: 'priority', label: 'Priority', width: '0.5fr' },
        { key: 'created', label: 'Created', width: '0.5fr' },
        { key: 'updated', label: 'Updated', width: '0.5fr' },
        { key: 'agent', label: 'Agent', width: '0.5fr' },
        { key: 'delete', label: 'Delete', width: '0.5fr', styles: { marginLeft: viewport == 'desktop' ? "30px" : '', cursor: 'pointer' } },
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
                return viewport == 'mobile' ? <InfiniteTableRowMobile 
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
                        new Date(t.updatedAt).toLocaleString(),
                        <select
                            value={t.assigneeId ?? ''}
                            onChange={(e) => handeleTicketUpdate({ ...t, assigneeId: e.target.value })}>
                            {props.agents.map(agent => {
                                return <option key={agent.id} value={agent.id}>{agent.name}</option>
                            })}
                        </select>,
                        <span onClick={() => handeleTicketDelete(t.id)}>{TrashIcon}</span>
                    ]}
                </InfiniteTableRowMobile> : <InfiniteTableRow 
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
                        new Date(t.updatedAt).toLocaleString(),
                        <select
                            value={t.assigneeId ?? ''}
                            onChange={(e) => handeleTicketUpdate({ ...t, assigneeId: e.target.value })}>
                            {props.agents.map(agent => {
                                return <option value={agent.id}
                                    key={agent.id}>{agent.name}</option>
                            })}
                        </select>,
                        <span onClick={() => handeleTicketDelete(t.id)}>{TrashIcon}</span>
                    ]}
                </InfiniteTableRow>
            }
            )}
            {isFetchingNextPage && <p>Fetching more...</p>}
        </InfiniteTable>
    );
};

export default TicketList;