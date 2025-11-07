import InfiniteScroll from 'react-infinite-scroll-component';
import { useInfiniteTickets } from '@/hooks/useInfiniteTickets';
import TicketRow from '@/features/ticket-list/TicketRow';

const TicketList = () => {
    const {
        tickets,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    } = useInfiniteTickets();

    if (isLoading) {
        return <p>Loading tickets...</p>;
    }

    return (
        <InfiniteScroll
            dataLength={tickets.length}
            next={fetchNextPage}
            hasMore={!!hasNextPage}
            loader={<p>Loading more...</p>}
            endMessage={<p style={{ textAlign: 'center' }}>No more tickets</p>}
            scrollThreshold={0.8} // load earlier (optional)
        >
            {tickets.map((t) => (
                <TicketRow key={t.id} ticket={t} />
            ))}
            {isFetchingNextPage && <p>Fetching more...</p>}
        </InfiniteScroll>
    );
};

export default TicketList;