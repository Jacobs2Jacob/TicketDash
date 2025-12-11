import React, { useCallback, useMemo } from 'react'; 
import { useSelector } from 'react-redux';
import { selectAllTickets } from '../../redux/selectors/ticketSelectors'; 
import type { Agent } from '../../entities/agents/model/agent';
import { useInfiniteTickets } from '../../entities/tickets/hooks/useInfiniteTickets';
import type { Ticket } from '../../entities/tickets/model/ticket';
import { TicketStatus, TicketPriority } from '../../entities/tickets/types/ticketTypes';
import { TrashIcon } from '../../shared/components/Icons/icons';
import { type Column, buildColumnTemplate, InfiniteTable } from '../../shared/components/InfiniteTable/InfiniteTable';
import InfiniteTableRow from '../../shared/components/InfiniteTable/InfiniteTableRow';
import InfiniteTableRowMobile from '../../shared/components/InfiniteTable/InfiniteTableRowMobile';
import { useViewport } from '../../shared/hooks/useViewport';

interface TicketListProps {
    onUpdate: (ticket: Ticket) => void;
    onDelete: (id: string) => void;
    agents: Agent[];
    filters?: { status?: string; priority?: string };
}

const TicketList = (props: TicketListProps) => {

    const storeTickets = useSelector(selectAllTickets);
    const viewport = useViewport();

    const { 
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading
    } = useInfiniteTickets(props.filters);
     
    const columns: Column[] = useMemo(() => [
        { key: 'title', label: 'Title', width: '1fr' },
        { key: 'status', label: 'Status', width: '0.5fr' },
        { key: 'priority', label: 'Priority', width: '0.5fr' },
        { key: 'created', label: 'Created', width: '0.5fr' },
        { key: 'updated', label: 'Updated', width: '0.5fr' },
        { key: 'agent', label: 'Agent', width: '0.5fr' },
        { key: 'delete', label: 'Delete', width: '0.5fr', styles: { marginLeft: viewport == 'desktop' ? "30px" : '', cursor: 'pointer' } },
    ], [viewport]);

    const columnTemplate = useMemo(() => {
        return buildColumnTemplate(columns);
    }, [columns]);

    const handeleTicketDelete = useCallback(async (id: string) => {
        props.onDelete(id);
    }, [props.onDelete])

    const handeleTicketUpdate = useCallback(async (ticket: Ticket) => {
        props.onUpdate(ticket);
    }, [props.onUpdate])

    if (isLoading) {
        return <p>Loading tickets...</p>;
    } 

    return (
        <InfiniteTable
            columns={columns}
            dataLength={storeTickets.length}
            hasMore={!!hasNextPage}
            next={fetchNextPage}
            loader={<p>Loading more tickets...</p>}
        >
            {storeTickets.map((t) => {
                return viewport == 'mobile' ? <InfiniteTableRowMobile 
                    key={t.id}
                    columns={columns}
                    columnTemplate={columnTemplate}>
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
                    columnTemplate={columnTemplate}>
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

export default React.memo(TicketList);