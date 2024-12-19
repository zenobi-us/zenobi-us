import { loadConfig } from 'zod-config';
import path from 'path';
import { dotEnvAdapter } from 'zod-config/dotenv-adapter';

import { Schema } from './schema';

const filepath = path.resolve(__dirname, '.env');

export const Config = loadConfig({
  schema: Schema,
  adapters: [
    dotEnvAdapter({
      path: filepath,
      prefixKey: 'ZENOBIUS_',
    }),
  ],
});
