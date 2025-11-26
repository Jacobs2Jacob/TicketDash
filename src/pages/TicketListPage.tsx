import { lazy, Suspense, useEffect, useCallback, useState, useMemo } from 'react';
import TicketList from '@/features/ticket-list/TicketList';
import TicketFilters from '@/features/ticket-list/TicketFilters'; 
import { ticketApi } from '@/services/api/ticketApi';
import { TicketPriority, TicketStatus } from '../types/ticketTypes';
import type { Ticket } from '@/entities/ticket';
import type { Agent } from '@/entities/agent';
import { agentApi } from '../services/api/agentApi'; 

// lazy loading modal
const TicketModal = lazy(() => import('@/features/ticket-create-modal/TicketModal'));

const TicketListPage = () => {

    const [isModalOpen, setModalOpen] = useState(false);
    const [agents, setAgents] = useState<Agent[]>([]);
    const [priority, setPriority] = useState<string>('');
    const [status, setStatus] = useState<string>('');

    // for editing existing ticket (future requirements)
    const [ticket, setTicket] = useState<Ticket>(); 
     
    const handleUpdateClick = useCallback(async (ticket: Ticket) => {
        await ticketApi.updateTicket(ticket.id, ticket);
    }, [])

    const handleDeleteClick = useCallback(async (id: string) => {
        await ticketApi.deleteTicket(id); 
    }, [])

    const handlePrioritySelect = useCallback((val: TicketPriority) => {
      setPriority(TicketPriority[val]);
    }, []);

    const handleStatusSelect = useCallback((val: TicketStatus) => {
      setStatus(TicketStatus[val]);
    }, []);

    useEffect(() => {
        const getAgents = async () => {
            const all = await agentApi.getAgents();
            setAgents(all);
        };
        getAgents();
    }, []);

    // memoize filters to prevent unnecessary re-renders
    const filters = useMemo(() => ({ status, priority }),
        [status, priority]);
       
    return (
        <div>
            <div style={{ display: 'flex' }}>
                <TicketFilters
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

            {isModalOpen && (
                <Suspense fallback={<div>Loading modal...</div>}>
                    <TicketModal
                        open={isModalOpen}
                        ticket={ticket}
                        onClose={() => setModalOpen(false)}
                    />
                </Suspense>
            )}
        </div>
    );
};

export default TicketListPage;