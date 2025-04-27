import { ReactNode } from 'react';

import { z } from 'zod';

export const chipsOptionPropsSchema = z.object({
  paramName: z.string(),
  value: z.union([z.string(), z.number()]),
  isSelected: z.boolean(),
  onSelect: z.function(z.tuple([z.union([z.string(), z.number()])], z.void())),
  children: z.custom<ReactNode>(),
  nonClickable: z.boolean().optional(),
});

export type TChipsOptionProps = z.infer<typeof chipsOptionPropsSchema>;

export const chipsGroupPropsSchema = z.object({
  name: z.string(),
  label: z.string(),
  options: z.array(
    z.object({
      id: z.union([z.string(), z.number()]), // id can be a string or a number
      name: z.string(),
    })
  ),
  selectedChips: z.array(z.union([z.string(), z.number()])),
  setSelectedChips: z.function(z.tuple([z.array(z.union([z.string(), z.number()]))], z.void())),
  loading: z.boolean().optional(),
  errorMessage: z.string().optional(),
});

export type TChipGroupProps = z.infer<typeof chipsGroupPropsSchema>;
