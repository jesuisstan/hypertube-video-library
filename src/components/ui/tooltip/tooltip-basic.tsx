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

type TTooltipBasicProps = {
  trigger?: React.ReactNode;
  children: React.ReactNode;
  sideOffset?: number;
};

const TooltipBasic: FC<TTooltipBasicProps> = ({ trigger, children, sideOffset = 1 }) => {
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
              <CircleAlert size={21} className="text-c42orange" />
            </ButtonCustom>
          )}
        </TooltipTrigger>
        <TooltipContent
          sideOffset={sideOffset}
          className="bg-card text-card-foreground shadow-primary/20 rounded-md px-3 py-1 shadow-md"
        >
          {children}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default TooltipBasic;
