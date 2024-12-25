import clsx from 'clsx';
import { LoaderCircle } from 'lucide-react';

const Spinner = ({ size = 16, color }: { size?: number; color?: string }) => {
  return (
    <div>
      <LoaderCircle
        size={size}
        className={clsx('animate-spin', color ? `text-${color}` : `text-c42orange`)}
      />
    </div>
  );
};

export default Spinner;
