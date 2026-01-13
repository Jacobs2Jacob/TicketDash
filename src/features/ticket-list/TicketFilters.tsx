import { TicketStatus, TicketPriority } from "../../entities/tickets/types/ticketTypes";

interface TicketFiltersProps {
    currentStatus?: string;
    currentPriority?: string;
    onStatusSelect: (status: TicketStatus | null) => void;
    onPrioritySelect: (priority: TicketPriority | null) => void;
}

const TicketFilters = (props: TicketFiltersProps) => {
    
    // Convert URL string values back to enum numbers for select value
    const statusValue = props.currentStatus 
        ? TicketStatus[props.currentStatus as keyof typeof TicketStatus] 
        : '';
    const priorityValue = props.currentPriority 
        ? TicketPriority[props.currentPriority as keyof typeof TicketPriority] 
        : '';
    
    return (
        <div style={{ marginBottom: '0.75rem', display: 'flex', gap: '0.5rem' }}>
            <select 
                value={statusValue} 
                onChange={(e) => {
                    const val = e.target.value;
                    props.onStatusSelect(val === '' ? null : Number(val) as TicketStatus);
                }}>
                <option value="">All statuses</option>
                <option value={TicketStatus.Open}>Open</option>
                <option value={TicketStatus.InProgress}>In Progress</option>
                <option value={TicketStatus.Resolved}>Resolved</option>
            </select>
            <select 
                value={priorityValue} 
                onChange={(e) => {
                    const val = e.target.value;
                    props.onPrioritySelect(val === '' ? null : Number(val) as TicketPriority);
                }}>
                <option value="">All priorities</option>
                <option value={TicketPriority.Low}>Low</option>
                <option value={TicketPriority.Medium}>Medium</option>
                <option value={TicketPriority.High}>High</option>
                <option value={TicketPriority.Critical}>Critical</option>
            </select>
        </div>
    );
};

export default TicketFilters;