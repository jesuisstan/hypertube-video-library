'use client';

import * as React from 'react';

import * as SeparatorPrimitive from '@radix-ui/react-separator';
import clsx from 'clsx';

interface SeparatorProps extends React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root> {
  text?: string; // Optional text to display in the center
}

const Separator = React.forwardRef<
  React.ComponentRef<typeof SeparatorPrimitive.Root>,
  SeparatorProps
>(({ className, orientation = 'horizontal', decorative = true, text, ...props }, ref) => {
  const isHorizontal = orientation === 'horizontal';

  return (
    <div className={clsx('relative flex items-center', isHorizontal ? 'w-full' : 'h-full')}>
      {/* Left Line */}
      <SeparatorPrimitive.Root
        ref={ref}
        decorative={decorative}
        orientation={orientation}
        className={clsx(
          'bg-border shrink-0',
          isHorizontal ? 'h-[1px] flex-1' : 'h-full w-[1px] flex-1',
          className
        )}
        {...props}
      />
      {/* Text */}
      {text && (
        <span
          className={clsx(
            'text-muted-foreground px-2 text-sm font-medium select-none',
            isHorizontal ? 'whitespace-nowrap' : 'rotate-90'
          )}
        >
          {text}
        </span>
      )}
      {/* Right Line */}
      <SeparatorPrimitive.Root
        decorative={decorative}
        orientation={orientation}
        className={clsx(
          'bg-border shrink-0',
          isHorizontal ? 'h-[1px] flex-1' : 'h-full w-[1px] flex-1',
          className
        )}
        {...props}
      />
    </div>
  );
});
Separator.displayName = SeparatorPrimitive.Root.displayName;

export { Separator };
