import type { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { ThemeProvider } from '../context/ThemeContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

type ProvidersProps = {
    children: ReactNode;
};

export const Providers = ({ children }: ProvidersProps) => {

    const queryClient = new QueryClient();

    return (
        <Provider store={store}>
            <QueryClientProvider client={queryClient}>
                <ThemeProvider>{children}</ThemeProvider>
            </QueryClientProvider>
        </Provider>
    );
};