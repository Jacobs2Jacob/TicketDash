import { useEffect, useState } from 'react';
import TicketList from '@/features/ticket-list/TicketList';
import TicketFilters from '@/features/ticket-list/TicketFilters';
import TicketModal from '../features/ticket-crud-modal/TicketModal';
import { ticketApi } from '@/services/api/ticketApi';
import { TicketPriority, TicketStatus } from '../types/ticketTypes';
import { useDispatch } from 'react-redux';
import { ticketsReceived } from '../redux/slices/ticketSlice';

const TicketListPage = () => {

    const [isModalOpen, setModalOpen] = useState(false);
    const [priority, setPriority] = useState<string>('');
    const [status, setStatus] = useState<string>('');
    const dispatch = useDispatch();

    const handleFiltering = async () => {
        const tickets = await ticketApi.getTickets({ status, priority });
        dispatch(ticketsReceived(tickets));
    }

    useEffect(() => {
        if (priority !== '' || status !== '') {
            handleFiltering();
        }
    }, [priority, status]);

    return (
        <div>
            <div style={{ display: 'flex' }}>
                <TicketFilters
                    onPrioritySelect={val => setPriority(TicketPriority[val])}
                    onStatusSelect={val => setStatus(TicketStatus[val])} />
                <button onClick={() => setModalOpen(true)}
                    style={{ marginLeft: 'auto' }}>Create</button>
            </div>

            <TicketList />

            <TicketModal open={isModalOpen} onClose={() => setModalOpen(false)} />
        </div>
    );
};

export default TicketListPage;