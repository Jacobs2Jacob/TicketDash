import { lazy, Suspense, useEffect, useCallback, useState } from 'react';
import TicketList from '@/features/ticket-list/TicketList';
import TicketFilters from '@/features/ticket-list/TicketFilters'; 
import { ticketApi } from '@/services/api/ticketApi';
import { TicketPriority, TicketStatus } from '../types/ticketTypes';
import { useDispatch } from 'react-redux';
import { ticketsReceived } from '../redux/slices/ticketSlice';
import type { Ticket } from '@/entities/ticket';  

const TicketModal = lazy(() => import('@/features/ticket-create-modal/TicketModal'));

const TicketListPage = () => {

    const [isModalOpen, setModalOpen] = useState(false);
    const [priority, setPriority] = useState<string>('');
    const [status, setStatus] = useState<string>('');
    const [ticket, setTicket] = useState<Ticket>();
    const dispatch = useDispatch();
     
    const handleFiltering = async () => {
        const tickets = await ticketApi.getTickets({ status, priority });
        dispatch(ticketsReceived(tickets));
    }

    const handleUpdateClick = useCallback(async (ticket: Ticket) => {
        await ticketApi.updateTicket(ticket);
    }, [])

    const handleDeleteClick = useCallback(async (id: string) => {
        await ticketApi.deleteTicket(id); 
    }, [])

    useEffect(() => {
        // if any filter has been touched
        if (priority !== '' || status !== '') {
            handleFiltering();
        }
    }, [priority, status]);

    useEffect(() => {
        if (ticket) {
            setModalOpen(true);
        }
    }, [ticket]);

    return (
        <div>
            <div style={{ display: 'flex' }}>
                <TicketFilters
                    onPrioritySelect={val => setPriority(TicketPriority[val])}
                    onStatusSelect={val => setStatus(TicketStatus[val])} />
                <button onClick={() => {
                    setTicket(null!);
                    setModalOpen(true);
                }}
                    style={{ marginLeft: 'auto' }}>Create</button>
            </div>

            <TicketList onUpdate={handleUpdateClick} onDelete={handleDeleteClick} />

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