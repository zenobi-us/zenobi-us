import { z } from 'zod';

export const Schema = z.object({
  MODE: z
    .string()
    .pipe(z.enum(['development', 'production']))
    .default('development'),
});
