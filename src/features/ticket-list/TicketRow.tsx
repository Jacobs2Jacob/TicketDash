import React from 'react';
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

interface TicketProps {
    ticket: Ticket;
}

const TicketRow = (props: TicketProps) => {
        return (
            <div className={styles.row}>
                <div>{props.ticket.title}</div>
                <div className={styles.desc}>{props.ticket.description}</div>
                <div className={`${styles.badge} ${priorityClass(props.ticket.priority)}`}>
                    {props.ticket.priority}
                </div>
                <div>{props.ticket.status}</div>
            </div>
        );
    }

export default React.memo(TicketRow);