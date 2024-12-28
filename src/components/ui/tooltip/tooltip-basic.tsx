'use client';

import { FC, useState } from 'react';

import { CircleAlert } from 'lucide-react';

import { ButtonCustom } from '@/components/ui/buttons/button-custom';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip/tooltip-primitives';

interface TooltipBasicProps {
  trigger?: React.ReactNode;
  children: React.ReactNode;
  sideOffset?: number;
}

const TooltipBasic: FC<TooltipBasicProps> = ({ trigger, children, sideOffset = 1 }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <TooltipProvider>
      <Tooltip open={isOpen} onOpenChange={setIsOpen}>
        <TooltipTrigger asChild onClick={handleToggle} className="w-fit">
          {trigger || (
            <ButtonCustom
              aria-label="Help"
              type="button"
              variant="ghost"
              size="icon"
              className="hover:bg-inherit"
            >
              <CircleAlert
                size={21}
                className="m-1 text-c42orange smooth42transition hover:scale-110"
              />
            </ButtonCustom>
          )}
        </TooltipTrigger>
        <TooltipContent
          sideOffset={sideOffset}
          className="rounded-md bg-card px-3 py-1 text-card-foreground shadow-md"
        >
          {children}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default TooltipBasic;
