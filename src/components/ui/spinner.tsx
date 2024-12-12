import clsx from 'clsx';
import { LoaderPinwheel } from 'lucide-react';

const Spinner = ({ size = 16, color }: { size?: number; color?: string }) => {
  return (
    <div>
      <LoaderPinwheel
        size={size}
        className={clsx('animate-spin', color ? `text-${color}` : `text-foreground`)}
      />
    </div>
  );
};

export default Spinner;
