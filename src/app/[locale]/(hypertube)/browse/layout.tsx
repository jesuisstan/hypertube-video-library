import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Browse Hypertube',
};

const BrowseLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-card shadow-primary/20 m-4 rounded-md border p-4 shadow-xs">{children}</div>
  );
};

export default BrowseLayout;
