import { useState } from 'react'; 
import Button from '@/components/Button/Button';
import { ticketApi } from '@/services/api/ticketApi'; 
import type { Ticket } from '@/entities/ticket';
import { TicketPriority, TicketStatus } from '../../types/ticketTypes'; 
import Modal from '../../components/Modal/Modal';
 
type TicketModalProps = {
    open: boolean;
    onClose: () => void;
    ticket?: Ticket;
};
 
const TicketModal = ({ open, onClose, ticket }: TicketModalProps) => { 
    const [title, setTitle] = useState(ticket?.title);
    const [description, setDescription] = useState(ticket?.description);
    const [priority, setPriority] = useState<TicketPriority>(
        ticket?.priority ?? TicketPriority.Medium
    );
    const [status, setStatus] = useState<TicketStatus>(
        ticket?.status ?? TicketStatus.Open
    );
    const [submitting, setSubmitting] = useState(false);
     
    const handleSubmit = async () => {
        setSubmitting(true);

        try {
            // CREATE new
            const created = await ticketApi.createTicket({
                title,
                description,
                priority
            }); 
             
            onClose();
        }
        catch (err) {
            console.error('Ticket save failed:', err);
        }
        finally {
            setSubmitting(false);
        }
    };

    return ( 
        <Modal
            open={open}
            onClose={onClose}
            title={ticket ? 'Edit Ticket' : 'Create Ticket'}
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <label>
                    <span>Title</span>
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        disabled={submitting}
                    />
                </label>
                <label>
                    <span>Description</span>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        disabled={submitting}
                    />
                </label>
                <label>
                    <span>Priority</span>
                    <select
                        value={priority}
                        onChange={(e) =>
                            setPriority(Number(e.target.value) as TicketPriority)
                        }
                        disabled={submitting}
                    >
                        <option value={TicketPriority.Low}>Low</option>
                        <option value={TicketPriority.Medium}>Medium</option>
                        <option value={TicketPriority.High}>High</option>
                        <option value={TicketPriority.Critical}>Critical</option>
                    </select>
                </label>
                <label>
                    <span>Status</span>
                    <select
                        value={status}
                        onChange={(e) =>
                            setStatus(Number(e.target.value) as TicketStatus)
                        }
                        disabled={submitting}
                    >
                        <option value={TicketStatus.Open}>Open</option>
                        <option value={TicketStatus.InProgress}>In Progress</option>
                        <option value={TicketStatus.Resolved}>Resolved</option>
                    </select>
                </label>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: '0.5rem',
                    }}
                >
                    <Button variant="ghost" onClick={onClose} disabled={submitting}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={submitting}>
                        {ticket ? 'Save' : 'Create'}
                    </Button>
                </div>
            </div>
        </Modal>  
    );
};

export default TicketModal;