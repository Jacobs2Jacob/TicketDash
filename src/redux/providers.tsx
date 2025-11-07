import type { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { ThemeProvider } from '../context/ThemeContext';

type ProvidersProps = {
    children: ReactNode;
};

export const Providers = ({ children }: ProvidersProps) => {
    return (
        <Provider store={store}>
            <ThemeProvider>{children}</ThemeProvider>
        </Provider>
    );
};