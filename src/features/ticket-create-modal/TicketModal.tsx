import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Button from '@/components/Button/Button';
import { ticketApi } from '@/services/api/ticketApi';
import type { Ticket } from '@/entities/ticket';
import { TicketPriority, TicketStatus } from '../../types/ticketTypes';
import Modal from '../../components/Modal/Modal';
import styles from './TicketModal.module.css';

type TicketModalProps = {
    open: boolean;
    onClose: () => void;
    ticket?: Ticket;
};

type TicketFormData = {
    title: string;
    description: string;
    priority: TicketPriority;
    status: TicketStatus;
};

const TicketModal = ({ open, onClose, ticket }: TicketModalProps) => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<TicketFormData>({
        defaultValues: {
            title: ticket?.title ?? '',
            description: ticket?.description ?? '',
            priority: ticket?.priority ?? TicketPriority.Medium,
            status: ticket?.status ?? TicketStatus.Open,
        },
    });

    // Reset the form whenever a new ticket is passed (edit mode)
    useEffect(() => {
        reset({
            title: ticket?.title ?? '',
            description: ticket?.description ?? '',
            priority: ticket?.priority ?? TicketPriority.Medium,
            status: ticket?.status ?? TicketStatus.Open,
        });
    }, [ticket, reset]);

    const onSubmit = async (data: TicketFormData) => {
        try {
            if (ticket) {
                await ticketApi.updateTicket(ticket.id, data);
            } else {
                await ticketApi.createTicket(data);
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
                        className={`${styles.select} ${errors.priority ? styles.inputError : ''
                            }`}
                        disabled={isSubmitting}
                    >
                        <option value={TicketPriority.Low}>Low</option>
                        <option value={TicketPriority.Medium}>Medium</option>
                        <option value={TicketPriority.High}>High</option>
                        <option value={TicketPriority.Critical}>Critical</option>
                    </select>
                    {errors.priority && (
                        <div className={styles.errorLabel}>{errors.priority.message}</div>
                    )}
                </label>

                <label className={styles.label}>
                    <span>Status</span>
                    <select
                        className={`${styles.select} ${errors.status ? styles.inputError : ''
                            }`}
                        disabled={isSubmitting}
                    >
                        <option value={TicketStatus.Open}>Open</option>
                        <option value={TicketStatus.InProgress}>In Progress</option>
                        <option value={TicketStatus.Resolved}>Resolved</option>
                    </select>
                    {errors.status && (
                        <div className={styles.errorLabel}>{errors.status.message}</div>
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