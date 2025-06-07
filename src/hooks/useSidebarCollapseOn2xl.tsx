import { useEffect, useRef } from 'react';

import { useSidebar } from '@/components/ui/sidebar';

const SIDEBAR_COLLAPSE_WIDTH = 1920;

const useSidebarCollapseOn2xl = () => {
  const { setOpen, open } = useSidebar();
  const manuallyOpenedRef = useRef(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > SIDEBAR_COLLAPSE_WIDTH) return;

      // Automatically close if the user has not manually opened the sidebar
      if (!manuallyOpenedRef.current) {
        setOpen(false);
      }
    };

    // On first render
    if (window.innerWidth <= SIDEBAR_COLLAPSE_WIDTH) {
      setOpen(false);
    }
    console.log('window.innerWidth', window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Track manual opening
  useEffect(() => {
    if (open && window.innerWidth <= SIDEBAR_COLLAPSE_WIDTH) {
      manuallyOpenedRef.current = true;
    }
  }, [open]);
};

export default useSidebarCollapseOn2xl;
