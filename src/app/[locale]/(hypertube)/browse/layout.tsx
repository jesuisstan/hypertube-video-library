import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Browse Hypertube',
};

const BrowseLayout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default BrowseLayout;
