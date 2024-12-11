import type { LogoProps } from '~/components/common/favicons/Logo';
import { FormField } from '~/components/ds/form/FormField';
import { FormItem } from '~/components/ds/form/FormItem';
import { FormLabel } from '~/components/ds/form/FormLabel';
import { FormControl } from '~/components/ds/form/FormControl';
import { FormMessage } from '~/components/ds/form/FormMessages';

import { Colours } from './Colours';
import { ColorPaletteInput } from './ColorPaletteInput';
import type { useLogoThemerForm } from './useLogoThemerForm';

export function LogoFormField<TName extends keyof LogoProps>({
  form,
  name,
  label,
}: {
  form: ReturnType<typeof useLogoThemerForm>['form'];
  name: TName;
  label: string;
}) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel className="display-none md:inline">{label}</FormLabel>
          <FormControl>
            <ColorPaletteInput
              palette={Colours}
              {...field}
              {...fieldState}
            />
          </FormControl>
          <FormMessage {...fieldState} />
        </FormItem>
      )}
    />
  );
}
