import React from 'react'; 
import styles from './InfiniteTable.module.css';
import type { Column } from './InfiniteTable';

interface InfiniteTableRowProps {
    children: string[];
    rowId: string;
    columnTemplate: string;
    columns: Column[];
    onColumnClick: (column: Column, rowId: string) => void;
}

const InfiniteTableRow = ({ children, columnTemplate, columns, onColumnClick, rowId }: InfiniteTableRowProps) => {
    
    return (
        <div
            className={styles.row}
            style={{ gridTemplateColumns: columnTemplate }}
        >
            {children.map((child, i) => (
                <span style={columns[i].styles}
                    onClick={() => onColumnClick(columns[i], rowId)}
                    key={columns[i].key}>{child}</span>
            ))}
        </div>
    );
};

export default React.memo(InfiniteTableRow);