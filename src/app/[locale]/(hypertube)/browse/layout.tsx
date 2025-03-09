import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Browse Hypertube',
};

const BrowseLayout = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex w-full flex-col">{children}</div>;
};

export default BrowseLayout;
