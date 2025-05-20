'use client';

import * as React from 'react';

import * as DialogPrimitive from '@radix-ui/react-dialog';
import clsx from 'clsx';

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={clsx(
      'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/80',
      className
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={clsx(
        'bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] fixed top-[50%] left-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border p-6 shadow-lg duration-200 sm:rounded-lg',
        className
      )}
      {...props}
    >
      {children}
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={clsx('flex flex-col space-y-1.5 text-center sm:text-left', className)}
    {...props}
  />
);
DialogHeader.displayName = 'DialogHeader';

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={clsx('flex justify-end sm:flex-row sm:space-x-2', className)} {...props} />
);
DialogFooter.displayName = 'DialogFooter';

const DialogTitle = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={clsx('text-lg leading-none font-semibold tracking-tight', className)}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={clsx('text-muted-foreground text-sm', className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};

// TODO DELETE: PREVIOUS CODE
//'use client';

//import * as React from 'react';

//import * as DialogPrimitive from '@radix-ui/react-dialog';
//import clsx from 'clsx';
//import { X } from 'lucide-react';

//function Dialog({ ...props }: React.ComponentProps<typeof DialogPrimitive.Root>) {
//  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
//}

//function DialogTrigger({ ...props }: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
//  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
//}

//function DialogPortal({ ...props }: React.ComponentProps<typeof DialogPrimitive.Portal>) {
//  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
//}

//function DialogClose({ ...props }: React.ComponentProps<typeof DialogPrimitive.Close>) {
//  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
//}

//function DialogOverlay({
//  className,
//  ...props
//}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
//  return (
//    <DialogPrimitive.Overlay
//      data-slot="dialog-overlay"
//      className={clsx(
//        'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50',
//        className
//      )}
//      {...props}
//    />
//  );
//}

//function DialogContent({
//  className,
//  children,
//  ...props
//}: React.ComponentProps<typeof DialogPrimitive.Content>) {
//  return (
//    <DialogPortal data-slot="dialog-portal">
//      <DialogOverlay />
//      <DialogPrimitive.Content
//        data-slot="dialog-content"
//        className={clsx(
//          'bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg',
//          className
//        )}
//        {...props}
//      >
//        {children}
//        <DialogPrimitive.Close className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 cursor-pointer rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4">
//          <X className="cursor-pointer" />
//          <span className="sr-only">Close</span>
//        </DialogPrimitive.Close>
//      </DialogPrimitive.Content>
//    </DialogPortal>
//  );
//}

//function DialogHeader({ className, ...props }: React.ComponentProps<'div'>) {
//  return (
//    <div
//      data-slot="dialog-header"
//      className={clsx('flex flex-col gap-2 text-center sm:text-left', className)}
//      {...props}
//    />
//  );
//}

//function DialogFooter({ className, ...props }: React.ComponentProps<'div'>) {
//  return (
//    <div
//      data-slot="dialog-footer"
//      className={clsx('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', className)}
//      {...props}
//    />
//  );
//}

//function DialogTitle({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>) {
//  return (
//    <DialogPrimitive.Title
//      data-slot="dialog-title"
//      className={clsx('text-lg leading-none font-semibold', className)}
//      {...props}
//    />
//  );
//}

//function DialogDescription({
//  className,
//  ...props
//}: React.ComponentProps<typeof DialogPrimitive.Description>) {
//  return (
//    <DialogPrimitive.Description
//      data-slot="dialog-description"
//      className={clsx('text-muted-foreground text-sm', className)}
//      {...props}
//    />
//  );
//}

//export {
//  Dialog,
//  DialogClose,
//  DialogContent,
//  DialogDescription,
//  DialogFooter,
//  DialogHeader,
//  DialogOverlay,
//  DialogPortal,
//  DialogTitle,
//  DialogTrigger,
//};
