'use client';

import { useTranslations } from 'next-intl';

import ChipsOption from '@/components/ui/chips/chips-option';
import SkeletonChips from '@/components/ui/skeletons/skeleton-chips';
import { chipsGroupPropsSchema, TChipGroupProps } from '@/types/chips';
import { capitalize } from '@/utils/format-string';

const ChipsGroup = ({
  name,
  label,
  options,
  selectedChips,
  setSelectedChips,
  loading,
  errorMessage,
}: TChipGroupProps) => {
  const t = useTranslations();

  const handleSelectAll = (event: React.FormEvent) => {
    event.preventDefault();
    setSelectedChips(options);
  };

  const handleUnselectAll = (event: React.FormEvent) => {
    event.preventDefault();
    setSelectedChips([]);
  };

  const handleChipSelect = (value: string) => {
    if (selectedChips?.includes(value)) {
      // If the chip is already selected, remove it from the array
      setSelectedChips(selectedChips.filter((chip) => chip !== value));
    } else {
      // If the chip is not selected, add it to the array
      setSelectedChips([...selectedChips, value]);
    }
  };

  /* Verifying the passed Props of the component */
  const verif = chipsGroupPropsSchema.safeParse({
    name,
    label,
    options,
    selectedChips,
    setSelectedChips,
    loading,
    errorMessage,
  });

  if (!verif.success) {
    console.error(verif.error);
    return null;
  }

  return loading || errorMessage || !options || options?.length === 0 ? (
    <SkeletonChips message={errorMessage} />
  ) : (
    <div id={`${label}-chips`} className="relative flex flex-col justify-center">
      <div className="mb-4 flex flex-row items-end gap-8">
        {label && <div className="text-base font-semibold text-foreground">{label}</div>}

        <div className="flex flex-row gap-7 text-xs font-normal text-secondary-foreground">
          <button
            className="hover:text-positive min-w-fit cursor-pointer text-left italic smooth42transition"
            onClick={handleSelectAll}
          >
            {t(`selector.select-all`)}
          </button>
          <button
            className="min-w-fit cursor-pointer text-left italic smooth42transition hover:text-c42orange"
            onClick={handleUnselectAll}
          >
            {t(`selector.unselect-all`)}
          </button>
        </div>
      </div>
      <div className="relative flex max-h-80 flex-row flex-wrap justify-start gap-2 overflow-y-auto p-1 sm:max-h-[350px]">
        {options.map((option: string, index: number) => {
          return (
            <ChipsOption
              key={`${option}-${index}`}
              paramName={name}
              value={option}
              isSelected={selectedChips!.includes(option)}
              onSelect={handleChipSelect}
            >
              <div>{capitalize(option)}</div>
            </ChipsOption>
          );
        })}
      </div>
    </div>
  );
};

export default ChipsGroup;
