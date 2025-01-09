import clsx from 'clsx';
import { CircleDashed } from 'lucide-react';

const Spinner = ({ size = 16, color }: { size?: number; color?: string }) => {
  return (
    <div>
      <CircleDashed
        size={size}
        className={clsx('animate-spin', color ? `text-${color}` : `text-c42orange`)}
      />
    </div>
  );
};

export default Spinner;
