import { useForm } from 'react-hook-form';
import { useCallback } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import { LogoPropSchema, type LogoProps } from '../../favicons/Logo';

export function useLogoThemerForm({
  initial,
}: {
  initial?: Partial<LogoProps> | null;
}) {
  const defaults = initial || LogoPropSchema.parse({});

  const form = useForm<LogoProps>({
    resolver: zodResolver(LogoPropSchema),
    defaultValues: defaults,
  });

  const reset = useCallback(() => {
    form.reset(defaults);
  }, [form, defaults]);

  return {
    form,
    defaults,
    reset,
  };
}
