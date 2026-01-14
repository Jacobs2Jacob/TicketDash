import { useForm } from 'react-hook-form'; 
import styles from './TicketModal.module.css';
import type { Ticket } from '../../entities/tickets/model/ticket';
import type { TicketPriority } from '../../entities/tickets/types/ticketTypes';
import { useTicketCrud } from '../../entities/tickets/hooks/useTicketCrud';
import Button from '../../shared/components/Button/Button';
import Modal from '../../shared/components/Modal/Modal';

type TicketModalProps = {
    open: boolean;
    onClose: () => void;
    ticket?: Ticket;
};

type TicketFormData = {
    title: string;
    description: string;
    priority: TicketPriority; 
};

const TicketModal = ({ open, onClose, ticket }: TicketModalProps) => {
    const { createTicket, isCreating, isUpdating } = useTicketCrud();
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<TicketFormData>({
        defaultValues: {
            title: ticket?.title ?? '',
            description: ticket?.description ?? '',
            priority: ticket?.priority ?? 'Medium', 
        },
    });

    const isSubmitting = isCreating || isUpdating;

    const onSubmit = async (data: TicketFormData) => {
        try {
            if (ticket) {
                //await updateTicket({ id: ticket.id, data });
            } else {
                await createTicket(data);
            }

            onClose();
        } catch (err) {
            console.error('Ticket save failed:', err);
            alert('Failed to save ticket. Please try again.');
        }
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            title={ticket ? 'Edit Ticket' : 'Create Ticket'}
        >
            <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
                <label className={styles.label}>
                    <span>Title</span>
                    <input
                        maxLength={160}
                        type="text"
                        {...register('title', { required: 'Title is required.' })}
                        className={`${styles.input} ${errors.title ? styles.inputError : ''
                            }`}
                        disabled={isSubmitting}
                    />
                    {errors.title && (
                        <div className={styles.errorLabel}>{errors.title.message}</div>
                    )}
                </label>

                <label className={styles.label}>
                    <span>Description</span>
                    <textarea
                        {...register('description', {
                            required: 'Description is required.',
                        })}
                        maxLength={200}
                        className={`${styles.textarea} ${errors.description ? styles.inputError : ''
                            }`}
                        disabled={isSubmitting}
                    />
                    {errors.description && (
                        <div className={styles.errorLabel}>
                            {errors.description.message}
                        </div>
                    )}
                </label>

                <label className={styles.label}>
                    <span>Priority</span>
                    <select
                        {...register('priority', { required: 'Priority is required.' })}
                        className={`${styles.select} ${errors.priority ? styles.inputError : ''}`}
                        disabled={isSubmitting}
                    >
                        <option value={'Low' as TicketPriority}>Low</option>
                        <option value={'Medium' as TicketPriority}>Medium</option>
                        <option value={'High' as TicketPriority}>High</option>
                        <option value={'Critical' as TicketPriority}>Critical</option>
                    </select>
                    {errors.priority && (
                        <div className={styles.errorLabel}>{errors.priority.message}</div>
                    )}
                </label>
                 
                <div className={styles.actions}>
                    <Button type="button" onClick={onClose} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                        {ticket ? 'Save' : 'Create'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default TicketModal;