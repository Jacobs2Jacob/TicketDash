import { forwardRef } from 'react';
import type { Ticket } from '@/entities/ticket';
import styles from './TicketRow.module.css';

const priorityClass = (p: Ticket['priority']) => {
    switch (p) {
        case 'Low':
            return styles.priorityLow;
        case 'Medium':
            return styles.priorityMedium;
        case 'High':
            return styles.priorityHigh;
        case 'Critical':
            return styles.priorityCritical;
    }
};

const TicketRow = forwardRef<HTMLDivElement, { ticket: Ticket }>(
    ({ ticket }, ref) => {
        return (
            <div ref={ref} className={styles.row}>
                <div>{ticket.title}</div>
                <div className={styles.desc}>{ticket.description}</div>
                <div className={`${styles.badge} ${priorityClass(ticket.priority)}`}>
                    {ticket.priority}
                </div>
                <div>{ticket.status}</div>
            </div>
        );
    }
);

export default TicketRow;