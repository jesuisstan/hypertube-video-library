import NotFound from '@/components/not-found-custom';

// Dynamically import the NotFound component with SSR disabled
//const NotFound = dynamic(() => import('@/components/not-found-custom'), { ssr: false });

export default NotFound;
