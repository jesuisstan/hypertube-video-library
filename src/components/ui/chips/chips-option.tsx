import React from 'react';

import clsx from 'clsx';

import { chipsOptionPropsSchema, TChipsOptionProps } from '@/types/chips';

const ChipsOption = ({
  paramName,
  value,
  isSelected,
  onSelect,
  children,
  nonClickable,
}: TChipsOptionProps) => {
  /* Verifying the passed Props of the component */
  const verif = chipsOptionPropsSchema.safeParse({
    paramName,
    value,
    isSelected,
    onSelect,
    children,
    nonClickable,
  });

  if (!verif.success) {
    console.error(verif.error);
    return null;
  }

  if (!value) {
    return;
  }

  // Utility function to get a string representation of children to show correct label on hover
  const getTitleFromChildren = (children: React.ReactNode): string => {
    if (typeof children === 'string' || typeof children === 'number') {
      return String(children);
    } else if (Array.isArray(children)) {
      return children.map(getTitleFromChildren).join(' ');
    } else if (React.isValidElement(children)) {
      const props = children.props as { children?: React.ReactNode };
      return props.children ? getTitleFromChildren(props.children) : '';
    } else {
      return '';
    }
  };

  return (
    <div
      role="option"
      aria-selected={isSelected}
      aria-labelledby={String(value)} // Ensure value is converted to a string
      title={getTitleFromChildren(children)}
      className={clsx(
        `flex h-6 min-w-[54px] flex-row items-center justify-center gap-1 whitespace-nowrap break-words rounded-3xl border-[1px] border-primary px-[9px] py-[2px] text-center text-xs font-normal normal-case leading-loose smooth42transition`,
        isSelected ? 'bg-foreground text-card dark:bg-foreground' : 'bg-card text-foreground',
        !nonClickable && 'cursor-pointer hover:border-c42orange'
      )}
      onClick={() => onSelect(value)}
    >
      <div className={clsx(`flex overflow-hidden text-ellipsis`, isSelected ? 'selected' : '')}>
        {children}
      </div>
    </div>
  );
};

export default ChipsOption;
