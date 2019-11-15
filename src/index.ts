import { outputFile, outputJSON, readFile } from 'fs-extra';
import { alias, broadcast } from '@waves/waves-transactions';
import { CHAIN_ID, MASTER_ACCOUNT_SEED, NODE_URL } from './constants';
import createAssets from './craeteAssets';
import createAccounts from './createAccounts';


export async function write(options: IOptions) {
    broadcast(alias({
        alias: 'master',
        chainId: CHAIN_ID
    }, MASTER_ACCOUNT_SEED), NODE_URL)
        .catch(() => null);

    const state = JSON.parse(await readFile(options.config, 'utf8'));
    const ASSETS = await createAssets(state.ASSETS || {});
    const ACCOUNTS = await createAccounts(state.ACCOUNTS || {}, ASSETS);

    if (options.mode === 'json') {
        await outputJSON(options.out, JSON.stringify({ ACCOUNTS, ASSETS }, null, 4));
    } else {
        await outputFile(options.out, tsTemplate({ ACCOUNTS, ASSETS }));
    }
}

const exportState = (state: any) => `export const STATE = ${JSON.stringify(state, null, 4)};`;
const exportConstant = (name: string, value: string | number) => `export const ${name} = "${value}";`;
const tsTemplate = (state: any) => [
    exportState(state),
    exportConstant('NODE_URL', NODE_URL),
    exportConstant('MASTER_ACCOUNT_SEED', MASTER_ACCOUNT_SEED),
    exportConstant('CHAIN_ID', CHAIN_ID),
    exportConstant('NETWORK_BYTE', CHAIN_ID.charCodeAt(0)),
].join('\n');

export interface IOptions {
    out: string;
    config: string;
    mode: 'json' | 'typesctipt';
}
