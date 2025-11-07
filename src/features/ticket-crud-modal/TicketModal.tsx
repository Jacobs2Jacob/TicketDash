import { useState } from 'react';
import Modal from '@/components/Modal/Modal';
import Button from '@/components/Button/Button';
import { ticketApi } from '@/services/api/ticketApi';
import { useDispatch } from 'react-redux';
import {
    ticketPatchedOptimistic,
    ticketPatchedConfirmed,
    ticketPatchedRollback,
} from '@/redux/slices/ticketSlice';
import type { Ticket } from '@/entities/ticket';

type TicketModalProps = {
    open: boolean;
    onClose: () => void;
    ticket?: Ticket;
};

const TicketModal = ({ open, onClose, ticket }: TicketModalProps) => {
    const dispatch = useDispatch();
    const [title, setTitle] = useState(ticket?.title ?? '');
    const [description, setDescription] = useState(ticket?.description ?? '');
    const [priority, setPriority] = useState<Ticket['priority']>(ticket?.priority ?? 'Medium');
    const [status, setStatus] = useState<Ticket['status']>(ticket?.status ?? 'Open');

    const handleSubmit = async () => {
        // optimistic
        const mid = crypto.randomUUID();

        if (ticket) {
            // edit
            const optimisticNext: Ticket = {
                ...ticket,
                title,
                description,
                priority,
                status,
                updatedAt: new Date().toISOString(),
            };
            dispatch(
                ticketPatchedOptimistic({
                    mid,
                    next: optimisticNext,
                    prev: ticket,
                })
            );
            try {
                const updated = await ticketApi.updateTicket(ticket.id, {
                    title,
                    description,
                    priority,
                    status,
                    version: ticket.version,
                }, mid);
                dispatch(
                    ticketPatchedConfirmed({
                        mid,
                        ticket: updated,
                    })
                );
                onClose();
            } catch (err: any) {
                // 409 etc
                dispatch(ticketPatchedRollback({ mid }));
            }
        } else {
            // create
            try {
                await ticketApi.createTicket({
                    title,
                    description,
                    priority,
                    status,
                });
                onClose();
            } catch (err) {
                // keep modal open, maybe show error
            }
        }
    };

    return (
        <Modal open={open} onClose={onClose} title={ticket ? 'Edit ticket' : 'Create ticket'}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <label>
                    <span>Title</span>
                    <input value={title} onChange={(e) => setTitle(e.target.value)} />
                </label>
                <label>
                    <span>Description</span>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
                </label>
                <label>
                    <span>Priority</span>
                    <select value={priority} onChange={(e) => setPriority(e.target.value as Ticket['priority'])}>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Critical">Critical</option>
                    </select>
                </label>
                <label>
                    <span>Status</span>
                    <select value={status} onChange={(e) => setStatus(e.target.value as Ticket['status'])}>
                        <option value="Open">Open</option>
                        <option value="InProgress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                    </select>
                </label>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                    <Button variant="ghost" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit}>
                        {ticket ? 'Save' : 'Create'}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default TicketModal;