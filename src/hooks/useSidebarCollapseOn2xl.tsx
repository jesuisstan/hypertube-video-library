import { useEffect, useRef } from 'react';

import { useSidebar } from '@/components/ui/sidebar';

export function useSidebarCollapseOn2xl() {
  const { setOpen, open } = useSidebar();
  const manuallyOpenedRef = useRef(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1800) return;

      // Автоматически закрывать только если пользователь сам не открывал
      if (!manuallyOpenedRef.current) {
        setOpen(false);
      }
    };

    // При первом рендере
    if (window.innerWidth < 1800) {
      setOpen(false);
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Отслеживаем ручное открытие
  useEffect(() => {
    if (open && window.innerWidth < 1800) {
      manuallyOpenedRef.current = true;
    }
  }, [open]);
}
