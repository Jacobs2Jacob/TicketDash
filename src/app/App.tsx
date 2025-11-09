import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppLayout from './AppLayout';
import { AppRoutes } from './routes';

const App = () => {

    useEffect(() => {
        const ensureMockLogin = async () => {

            // only fetch a token if one doesn’t exist
            const existingToken = localStorage.getItem('accessToken');

            if (existingToken) {
                return;
            }

            try {
                const res = await fetch('http://localhost:5288/api/login', { method: 'POST' });

                if (!res.ok) {
                    throw new Error('Login failed');
                }
                const { token } = await res.json();
                localStorage.setItem('accessToken', token);
                console.log('Mock token stored');
            } catch (err) {
                console.error('Mock login failed', err);
            }
        };

        ensureMockLogin();
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