import type { CSSProperties, ReactNode } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import styles from './InfiniteTable.module.css';
import { InfiniteTableHeader } from './InfiniteTableHeader';

export interface Column {
    key: string;
    label: string;
    width?: string;
    styles?: CSSProperties;
}

interface InfiniteTableProps {
    columns: Column[];
    dataLength: number;
    hasMore: boolean;
    next: () => void;
    height?: string;
    children: ReactNode;
    loader?: ReactNode;
    endMessage?: ReactNode;
    scrollThreshold?: number;
    className?: string;
}

export const InfiniteTable = ({
    columns,
    dataLength,
    hasMore,
    next,
    height = '80vh',
    children,
    loader,
    endMessage,
    scrollThreshold = 0.8,
    className,
}: InfiniteTableProps) => {

    const gridTemplate = columns.map((c) => c.width || '1fr').join(' ');

    return (
        <div
            className={`${styles.container} ${className || ''}`}
            style={{ height }}
        >
            <InfiniteTableHeader columns={columns} gridTemplate={gridTemplate} />

            <div id="scrollableDiv" className={styles.scrollable}>
                <InfiniteScroll
                    dataLength={dataLength}
                    next={next}
                    hasMore={hasMore}
                    loader={loader || <p>Loading more...</p>}
                    endMessage={endMessage || <p style={{ textAlign: 'center' }}>No more items</p>}
                    scrollThreshold={scrollThreshold}
                    scrollableTarget="scrollableDiv"
                >
                    {children}
                </InfiniteScroll>
            </div>
        </div>
    );
};