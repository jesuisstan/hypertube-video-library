import { useEffect, useRef } from 'react';

import { useSidebar } from '@/components/ui/sidebar';

export function useSidebarCollapseOn2xl() {
  const { setOpen, open } = useSidebar();
  const manuallyOpenedRef = useRef(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1800) return;

      // Automatically close if the user has not manually opened the sidebar
      if (!manuallyOpenedRef.current) {
        setOpen(false);
      }
    };

    // On first render
    if (window.innerWidth < 1800) {
      setOpen(false);
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Track manual opening
  useEffect(() => {
    if (open && window.innerWidth < 1800) {
      manuallyOpenedRef.current = true;
    }
  }, [open]);
}
