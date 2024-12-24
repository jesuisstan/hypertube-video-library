import { z } from 'zod';

export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  firstname: z.string(),
  lastname: z.string(),
  nickname: z.string(),
  biography: z.string(),
  tags: z.array(z.string()),
  registration_date: z.string(),
  last_action: z.string(),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
  address: z.string().nullable(),
  photos: z.array(z.string()),
  confirmed: z.boolean(),
  prefered_language: z.string(),
});

export type TUser = z.infer<typeof userSchema>;
