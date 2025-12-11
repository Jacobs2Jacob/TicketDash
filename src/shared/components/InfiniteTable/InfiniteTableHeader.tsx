import { type CSSProperties } from 'react';
import { type Column } from './InfiniteTable';
import styles from './InfiniteTable.module.css';

interface InfiniteTableHeaderProps {
    columns: Column[];
    gridTemplate: string;
}

export const InfiniteTableHeader = ({ columns, gridTemplate }: InfiniteTableHeaderProps) => (
    <div
        className={styles.header}
        style={{ gridTemplateColumns: gridTemplate } as CSSProperties}
    >
        {columns.map((col) => (
            <span key={col.key}>{col.label}</span>
        ))}
    </div>
);