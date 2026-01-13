import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppLayout from './AppLayout';
import { AppRoutes } from './routes';  
import { useAppDispatch } from '@/redux/hooks/useAppDispatch'; 
import { loginThunk } from '../redux/thunks/authThunks';

const App = () => {

    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(loginThunk());
    }, [dispatch]);

    return (
        <BrowserRouter>
            <AppLayout>
                <AppRoutes />
            </AppLayout>
        </BrowserRouter>
    );
};

export default App;