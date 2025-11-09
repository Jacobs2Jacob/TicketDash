import { TicketPriority, TicketStatus } from "../../types/ticketTypes";

interface TicketFiltersProps {
    onStatusSelect: (status: TicketStatus) => void;
    onPrioritySelect: (status: TicketPriority) => void;
}

const TicketFilters = (props: TicketFiltersProps) => {
    
    return (
        <div style={{ marginBottom: '0.75rem', display: 'flex', gap: '0.5rem' }}>
            <select onChange={val => props.onStatusSelect(Number(val.target.value))}>
                <option value={null!}>All statuses</option>
                <option value={TicketStatus.Open}>Open</option>
                <option value={TicketStatus.InProgress}>In Progress</option>
                <option value={TicketStatus.Resolved}>Resolved</option>
            </select>
            <select onChange={val => props.onPrioritySelect(Number(val.target.value))}>
                <option value={null!}>All priorities</option>
                <option value={TicketPriority.Low}>Low</option>
                <option value={TicketPriority.Medium}>Medium</option>
                <option value={TicketPriority.High}>High</option>
                <option value={TicketPriority.Critical}>Critical</option>
            </select>
        </div>
    );
};

export default TicketFilters;