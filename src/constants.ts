import { config } from 'dotenv';
import { join } from 'path';


config({
    path: join(__dirname, '../env/.env.custom')
})

export const MASTER_ACCOUNT_SEED = process.env.MASTER_ACCOUNT_SEED as string;
export const NODE_URL = `${(process.env.NODE_API_HOST as string)}:${(process.env.NODE_API_PORT as string)}`;
export const NODE_API_PORT = process.env.NODE_API_PORT as string;
export const WAVES_EXPLORER_PORT = process.env.WAVES_EXPLORER_PORT as string;
export const DATA_SERVICE_API_PORT = process.env.DATA_SERVICE_API_PORT as string;
export const CHAIN_ID = process.env.NODE_CHAIN_ID as string;
export const SMART_ASSET_SCRIPT = 'base64:BAbMtW/U';
export const DAP_SCRIPT = 'base64:AAIEAAAAAAAAAAQIAhIAAAAAAAAAAAEAAAABaQEAAAAEY2FsbAAAAAAFAAAAA25pbAAAAAEAAAACdHgBAAAABnZlcmlmeQAAAAAJAAH0AAAAAwgFAAAAAnR4AAAACWJvZHlCeXRlcwkAAZEAAAACCAUAAAACdHgAAAAGcHJvb2ZzAAAAAAAAAAAACAUAAAACdHgAAAAPc2VuZGVyUHVibGljS2V5oysiIA==';
export const ACCOUNT_SCRIPT = 'base64:BAkAAfQAAAADCAUAAAACdHgAAAAJYm9keUJ5dGVzCQABkQAAAAIIBQAAAAJ0eAAAAAZwcm9vZnMAAAAAAAAAAAAIBQAAAAJ0eAAAAA9zZW5kZXJQdWJsaWNLZXnYG58I';

export const DOCKER_NETWORK = 'waves';