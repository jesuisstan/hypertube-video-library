import clsx from 'clsx';
import { SquarePlay } from 'lucide-react';

const Spinner = ({ size = 16, color }: { size?: number; color?: string }) => {
  return (
    <div>
      <SquarePlay
        size={size}
        className={clsx('animate-ping', color ? `text-${color}` : `text-c42orange`)}
      />
    </div>
  );
};

export default Spinner;
