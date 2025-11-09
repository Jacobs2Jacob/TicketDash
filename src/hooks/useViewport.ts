import { useEffect, useState } from 'react';

export const useViewport = () => {
    const [isMobile, setIsMobile] = useState(() => window.innerWidth < 480);

    useEffect(() => {
        const handler = () => setIsMobile(window.innerWidth < 480);
        window.addEventListener('resize', handler);
        return () => window.removeEventListener('resize', handler);
    }, []);

    return isMobile ? 'mobile' : 'desktop';
};