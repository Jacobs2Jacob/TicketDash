import { Routes, Route, Navigate } from 'react-router-dom';
import TicketListPage from '@/pages/TicketListPage';

export const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<TicketListPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};