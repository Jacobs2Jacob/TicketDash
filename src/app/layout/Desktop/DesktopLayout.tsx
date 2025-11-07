import styles from './DesktopLayout.module.css';
import { useTheme } from '@/hooks/useTheme';

const DesktopLayout = ({ children }: { children: React.ReactNode }) => {
    const { toggleTheme } = useTheme();

    return (
        <div className={styles.shell}>
            <button onClick={() => toggleTheme()}>Toggle</button>
            <header className={styles.header}>Ticket Dashboard</header>
            <main className={styles.main}>{children}</main>
        </div>
    );
};

export default DesktopLayout;