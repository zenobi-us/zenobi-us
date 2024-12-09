import { useLocalStorageValue } from '@react-hookz/web';

import type { LogoProps } from './Logo';
import { LogoPropSchema } from './Logo';

const CLIENTSIDE_FAVICON_STORAGE_KEY = 'favicon-colours';
export function useClientSideFaviconColourStorage() {
  const storage = useLocalStorageValue<LogoProps>(
    CLIENTSIDE_FAVICON_STORAGE_KEY,
    {
      parse(str, fallback) {
        if (!str) {
          const colours = LogoPropSchema.safeParse(fallback);
          return colours.success ? colours.data : ({} as LogoProps);
        }

        try {
          const values = JSON.parse(str);
          const colours = LogoPropSchema.safeParse(values);
          if (colours.success) {
            return colours.data;
          }
        } catch (error) {
          console.error('Error parsing favicon colours', error);
          const colours = LogoPropSchema.safeParse(fallback);
          if (colours.success) {
            return colours.data;
          }
        }

        return {} as LogoProps;
      },
      initializeWithValue: false,
      defaultValue: {} as LogoProps,
    }
  );

  return {
    ...storage,
    value: storage.value ?? ({} as LogoProps),
  };
}
