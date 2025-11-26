import { type CSSProperties, type ReactNode, useMemo } from 'react';
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

export const buildColumnTemplate = (columns: Column[], defaultWidth?: number) => {
    return columns.map(c => c.width || `${defaultWidth ?? 1}fr`).join(' ');
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

    const columnTemplate = useMemo(() => {
        return buildColumnTemplate(columns);
    }, [columns]);

    return (
        <div
            className={`${styles.container} ${className || ''}`}
            style={{ height, marginTop: '5px' }}
        >
            <InfiniteTableHeader columns={columns} gridTemplate={columnTemplate} />

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