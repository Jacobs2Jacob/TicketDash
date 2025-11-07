import { useViewport } from '@/hooks/useViewport';
import DesktopLayout from './Desktop/DesktopLayout';
import MobileLayout from './Mobile/MobileLayout';

const AppLayout = ({ children }: { children: React.ReactNode }) => {
    const bp = useViewport();

    if (bp === 'mobile') {
        return <MobileLayout>{children}</MobileLayout>;
    }

    return <DesktopLayout>{children}</DesktopLayout>;
};

export default AppLayout;