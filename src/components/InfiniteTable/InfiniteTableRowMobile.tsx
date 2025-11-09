import React, { type ReactNode } from 'react'; 
import styles from './InfiniteTable.module.css';
import type { Column } from './InfiniteTable';

interface InfiniteTableRowProps {
    children: ReactNode[];
    columnTemplate: string;
    columns: Column[];
}

const InfiniteTableRowMobile = ({ children, columnTemplate, columns }: InfiniteTableRowProps) => {
    
    return (
        <div
            className={styles.row}
            style={{ gridTemplateColumns: columnTemplate }}
        >
            {children.map((child, i) => (
                <div style={columns[i].styles} key={columns[i].key}>
                    <label style={{ fontWeight: 'bold', marginRight: '5px' }}>
                        {columns[i].key}
                    </label>
                    {child}
                </div>
            ))}
        </div>
    );
};

export default React.memo(InfiniteTableRowMobile);