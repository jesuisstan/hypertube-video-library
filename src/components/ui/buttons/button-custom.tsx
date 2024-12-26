import * as React from 'react';

import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import clsx from 'clsx';

import Spinner from '@/components/ui/spinner';

const buttonVariants = cva(
  'inline-flex items-center justify-center space-x-2 rounded-md text-sm font-medium ring-offset-background smooth42transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'border bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-foreground hover:bg-destructive/90',
        outline:
          'border border-muted-foreground bg-background hover:bg-accent hover:text-accent-foreground hover:border-destructive',
        secondary: 'bg-muted-foreground text-secondary-foreground hover:bg-muted-foreground/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-10 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const ButtonCustom = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, asChild = false, loading = false, disabled, children, ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';

    return (
      <Comp
        className={clsx(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
        disabled={disabled || loading}
      >
        {loading ? (
          <Spinner size={16} color="background" />
        ) : (
          <span className="relative z-10 line-clamp-2 text-center">{children}</span>
        )}
      </Comp>
    );
  }
);
ButtonCustom.displayName = 'ButtonCustom';

export { ButtonCustom, buttonVariants };
