import { useInfiniteTickets } from '@/hooks/useInfiniteTickets';
import TicketRow from './TicketRow';
import styles from './TicketList.module.css';

const TicketList = () => {
    const { tickets, setLastRef, stale } = useInfiniteTickets();

    return (
        <div className={styles.wrapper}>
            {stale && <div className={styles.banner}>Reconnecting… data may be stale.</div>}
            <div className={styles.headerRow}>
                <span>Title</span>
                <span>Description</span>
                <span>Priority</span>
                <span>Status</span>
            </div>
            {tickets.map((t, idx) => {
                const isLast = idx === tickets.length - 1;
                return (
                    <TicketRow
                        key={t.id}
                        ticket={t}
                        ref={isLast ? setLastRef : undefined}
                    />
                );
            })}
        </div>
    );
};

export default TicketList;