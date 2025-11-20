import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppLayout from './AppLayout';
import { AppRoutes } from './routes'; 
import { loginThunk } from '../redux/thunks/authThunks';
import { useAppDispatch } from '@/redux/hooks/useAppDispatch'; 

const App = () => {

    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(loginThunk());
    }, []);

    return (
        <BrowserRouter>
            <AppLayout>
                <AppRoutes />
            </AppLayout>
        </BrowserRouter>
    );
};

export default App;