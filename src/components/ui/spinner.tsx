import clsx from 'clsx';
import { TvMinimalPlay } from 'lucide-react';

const Spinner = ({ size = 16, color }: { size?: number; color?: string }) => {
  return (
    <div>
      <TvMinimalPlay
        size={size}
        className={clsx('animate-ping', color ? `text-${color}` : `text-foreground`)}
      />
    </div>
  );
};

export default Spinner;
