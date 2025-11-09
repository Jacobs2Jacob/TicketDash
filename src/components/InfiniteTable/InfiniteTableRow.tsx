import React, { type ReactNode } from 'react'; 
import styles from './InfiniteTable.module.css';
import type { Column } from './InfiniteTable';

interface InfiniteTableRowProps {
    children: ReactNode[];
    rowId: string;
    columnTemplate: string;
    columns: Column[];
}

const InfiniteTableRow = ({ children, columnTemplate, columns }: InfiniteTableRowProps) => {
    
    return (
        <div
            className={styles.row}
            style={{ gridTemplateColumns: columnTemplate }}
        >
            {children.map((child, i) => (
                <span style={columns[i].styles}
                    key={columns[i].key}>{child}</span>
            ))}
        </div>
    );
};

export default React.memo(InfiniteTableRow);