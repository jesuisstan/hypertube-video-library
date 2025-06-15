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
} from '@/components/ui/dialog';

interface DialogModalBasicProps {
  isOpen: boolean;
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
  description?: string;
  children: React.ReactNode;
  trigger?: React.ReactNode;
  hideCloseButton?: boolean;
  wide?: boolean;
}

const DialogBasic: React.FC<DialogModalBasicProps> = ({
  isOpen,
  setIsOpen,
  title,
  description = '',
  children,
  trigger,
  hideCloseButton = false,
  wide = false,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent
        className={`xs:max-w-fit w-auto ${wide ? 'min-w-[96%]' : 'max-w-96 min-w-80'}`}
        onEscapeKeyDown={hideCloseButton && !setIsOpen ? (e) => e.preventDefault() : undefined}
        onPointerDownOutside={hideCloseButton && !setIsOpen ? (e) => e.preventDefault() : undefined}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {!hideCloseButton && (
          <DialogClose className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:pointer-events-none">
            <X className="h-4 w-4 cursor-pointer" />
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
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DialogBasic;
