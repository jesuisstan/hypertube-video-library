import React from 'react';
import Image from 'next/image';

import { X } from 'lucide-react';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/dialogs/dialog-primitives';

interface DialogModalBasicProps {
  isOpen: boolean;
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
  description?: string;
  children: React.ReactNode;
  trigger?: React.ReactNode;
  hideCloseButton?: boolean;
}

const DialogBasic: React.FC<DialogModalBasicProps> = ({
  isOpen,
  setIsOpen,
  title,
  description = '',
  children,
  trigger,
  hideCloseButton = false,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent
        className="sm:max-w-[425px]"
        onEscapeKeyDown={hideCloseButton && !setIsOpen ? (e) => e.preventDefault() : undefined}
        onPointerDownOutside={hideCloseButton && !setIsOpen ? (e) => e.preventDefault() : undefined}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {!hideCloseButton && (
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">X</span>
          </DialogClose>
        )}
        <div className="grid gap-4 py-4">{children}</div>
        <DialogFooter>
          <Image
            src="/identity/logo-title-only.png"
            blurDataURL="/identity/logo-title-only.png"
            alt="logo"
            width={121}
            height={0}
            placeholder="empty"
            priority
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DialogBasic;
