import type { TicketStatus, TicketPriority } from "../../entities/tickets/types/ticketTypes";

interface TicketFiltersProps {
    currentStatus?: string;
    currentPriority?: string;
    onStatusSelect: (status: TicketStatus | null) => void;
    onPrioritySelect: (priority: TicketPriority | null) => void;
}

const TicketFilters = (props: TicketFiltersProps) => {
    
    // Convert URL string values back to enum numbers for select value
    const statusValue = props.currentStatus;
    const priorityValue = props.currentPriority;
    
    return (
        <div style={{ marginBottom: '0.75rem', display: 'flex', gap: '0.5rem' }}>
            <select 
                value={statusValue} 
                onChange={(e) => {
                    const val = e.target.value;
                    props.onStatusSelect(val === '' ? null : val as TicketStatus);
                }}>
                <option value="">All statuses</option>
                <option value={'Open' as TicketStatus}>Open</option>
                <option value={'InProgress' as TicketStatus}>In Progress</option>
                <option value={'Resolved' as TicketStatus}>Resolved</option>
            </select>
            <select 
                value={priorityValue} 
                onChange={(e) => {
                    const val = e.target.value;
                    props.onPrioritySelect(val === '' ? null : val as TicketPriority);
                }}>
                <option value="">All priorities</option>
                <option value={'Low' as TicketPriority}>Low</option>
                <option value={'Medium' as TicketPriority}>Medium</option>
                <option value={'High' as TicketPriority}>High</option>
                <option value={'Critical' as TicketPriority}>Critical</option>
            </select>
        </div>
    );
};

export default TicketFilters;