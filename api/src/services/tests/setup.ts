import dotenv from 'dotenv';
import path from 'path';
import { debug } from 'util';

process.env.DOTENV_CONFIG_SILENT = 'true';

dotenv.config({ path: path.resolve(__dirname, '../../../.env'), quiet: true });
