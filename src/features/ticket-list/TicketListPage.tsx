import TicketList from './TicketList';
import TicketFilters from './TicketFilters';

const TicketListPage = () => {
    return (
        <div>
            <TicketFilters />
            <TicketList />
        </div>
    );
};

export default TicketListPage;