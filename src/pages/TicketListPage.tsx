import { useCallback, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import TicketList from '@/features/ticket-list/TicketList';
import TicketFilters from '@/features/ticket-list/TicketFilters';
import { TicketPriority, TicketStatus } from '@/entities/tickets/types/ticketTypes';
import type { Ticket } from '@/entities/tickets/model/ticket';
import { useTicketCrud } from '@/entities/tickets/hooks/useTicketCrud';
import { useAgents } from '@/entities/agents/hooks/useAgents';
import TicketModal from '@/features/ticket-create-modal/TicketModal';

const TicketListPage = () => {

    const [isModalOpen, setModalOpen] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const { agents } = useAgents();
    const { updateTicket, deleteTicket } = useTicketCrud();

    // Read filters from URL
    const statusParam = searchParams.get('status') || '';
    const priorityParam = searchParams.get('priority') || '';

    // for editing existing ticket (future requirements)
    const [ticket, setTicket] = useState<Ticket>(); 
     
    const handleUpdateClick = useCallback(async (ticket: Ticket) => {
        await updateTicket({ id: ticket.id, data: ticket });
    }, [updateTicket])

    const handleDeleteClick = useCallback(async (id: string) => {
        await deleteTicket(id); 
    }, [deleteTicket])

    const handlePrioritySelect = useCallback((val: TicketPriority | null) => {
        const newParams = new URLSearchParams(searchParams);
        if (val !== null) {
            newParams.set('priority', TicketPriority[val]);
        } else {
            newParams.delete('priority');
        }
        setSearchParams(newParams);
    }, [searchParams, setSearchParams]);

    const handleStatusSelect = useCallback((val: TicketStatus | null) => {
        const newParams = new URLSearchParams(searchParams);
        if (val !== null) {
            newParams.set('status', TicketStatus[val]);
        } else {
            newParams.delete('status');
        }
        setSearchParams(newParams);
    }, [searchParams, setSearchParams]);

    // memoize filters to prevent unnecessary re-renders
    const filters = useMemo(() => ({ 
        status: statusParam || undefined, 
        priority: priorityParam || undefined 
    }), [statusParam, priorityParam]);
       
    return (
        <div>
            <div style={{ display: 'flex' }}>
                <TicketFilters
                    currentStatus={statusParam}
                    currentPriority={priorityParam}
                    onPrioritySelect={handlePrioritySelect}
                    onStatusSelect={handleStatusSelect} />
                <button onClick={() => {
                    setTicket(null!);
                    setModalOpen(true);
                }}
                    style={{ marginLeft: 'auto' }}>Create</button>
            </div>

            <TicketList 
                agents={agents} 
                onUpdate={handleUpdateClick} 
                onDelete={handleDeleteClick}
                filters={filters}
            />

            {isModalOpen && <TicketModal
                open={isModalOpen}
                ticket={ticket}
                onClose={() => setModalOpen(false)}
            />}
        </div>
    );
};

export default TicketListPage;