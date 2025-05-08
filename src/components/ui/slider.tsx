'use client';

import * as React from 'react';

import * as SliderPrimitive from '@radix-ui/react-slider';
import clsx from 'clsx';

const Slider = React.forwardRef<
  React.ComponentRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={clsx('relative flex w-full touch-none items-center select-none', className)}
    {...props}
  >
    <SliderPrimitive.Track className="bg-muted relative h-2 w-full grow cursor-pointer overflow-hidden rounded-full">
      <SliderPrimitive.Range className="bg-primary absolute h-full" />
    </SliderPrimitive.Track>
    {/* Left range boundary */}
    <SliderPrimitive.Thumb className="border-primary bg-background ring-offset-background focus-visible:ring-ring block h-4 w-4 cursor-grab rounded-full border-2 transition-colors focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50" />
    {/* Right range boundary */}
    <SliderPrimitive.Thumb className="border-primary bg-background ring-offset-background focus-visible:ring-ring block h-4 w-4 cursor-grab rounded-full border-2 transition-colors focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50" />
  </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
