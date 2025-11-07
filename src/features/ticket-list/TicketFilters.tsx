

const TicketFilters = () => {
    // for now just placeholder, can sync with URL later
    return (
        <div style={{ marginBottom: '0.75rem', display: 'flex', gap: '0.5rem' }}>
            <input placeholder="Search…" />
            <select>
                <option value="">All statuses</option>
                <option value="Open">Open</option>
                <option value="InProgress">In Progress</option>
                <option value="Resolved">Resolved</option>
            </select>
            <select>
                <option value="">All priorities</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
            </select>
        </div>
    );
};

export default TicketFilters;