import styles from './Table.module.css';

const Table = ({ children }: { children: React.ReactNode }) => {
    return <div className={styles.table}>{children}</div>;
};

export default Table;