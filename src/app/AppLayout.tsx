import { ColorAccessibilityIcon } from '../shared/components/Icons/icons';
import { useTheme } from '../shared/hooks/useTheme';
import styles from './AppLayout.module.css';
  
const AppLayout = ({ children }: { children: React.ReactNode }) => {
    const { toggleTheme } = useTheme();

    return <div className={styles.shell}>
        <header className={styles.header}>Ticket Dashboard
            <button style={{ marginLeft: 'auto' }} onClick={() => toggleTheme()}>{ColorAccessibilityIcon}</button>
        </header>
        <main className={styles.main}>{children}</main>
    </div>
};

export default AppLayout;