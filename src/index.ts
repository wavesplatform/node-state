import { outputFile, readFile } from 'fs-extra';
import { alias, broadcast, libs } from '@waves/waves-transactions';
import { ACCOUNT_SCRIPT, CHAIN_ID, DAP_SCRIPT, MASTER_ACCOUNT_SEED, NODE_URL, SMART_ASSET_SCRIPT } from './constants';
import createAssets from './state/createAssets';
import createAccounts from './state/createAccounts';
import console from './utils/console';
import setSponsorship from './state/setSponsorship';
import setBalances from './state/setBalances';


export async function write(options: IOptions) {
    broadcast(alias({
        alias: 'master',
        chainId: CHAIN_ID
    }, MASTER_ACCOUNT_SEED), NODE_URL)
        .catch(() => null);

    const state = JSON.parse(await readFile(options.config, 'utf8'));
    const ACCOUNTS = await createAccounts(state.ACCOUNTS || {}, {});
    const ASSETS = await createAssets(state.ASSETS || {}, ACCOUNTS);
    await setBalances(state.ACCOUNTS || {}, ASSETS, ACCOUNTS);
    const SPONSORSHIPS = await setSponsorship(state.ASSETS || {}, ASSETS, ACCOUNTS);

    console.info('Success create state!');

    if (!options.out) {
        return undefined;
    }

    if (options.mode === 'json') {
        await outputFile(options.out, JSON.stringify({
            ACCOUNTS,
            ASSETS,
            SPONSORSHIPS,
            MASTER_ACCOUNT: {
                SEED: MASTER_ACCOUNT_SEED,
                ADDRESS: libs.crypto.address(MASTER_ACCOUNT_SEED, CHAIN_ID),
                PUBLIC_KEY: libs.crypto.publicKey(MASTER_ACCOUNT_SEED),
                ALIAS: 'master'
            },
            'NODE_URL': NODE_URL,
            'CHAIN_ID': CHAIN_ID,
            'NETWORK_BYTE': CHAIN_ID.charCodeAt(0),
            'SMART_ASSET_SCRIPT': SMART_ASSET_SCRIPT,
            'DAP_SCRIPT': DAP_SCRIPT,
            'ACCOUNT_SCRIPT': ACCOUNT_SCRIPT,
        }, null, 4));
    } else {
        await outputFile(options.out, tsTemplate({ ACCOUNTS, ASSETS, SPONSORSHIPS }));
    }
}

const exportState = (state: any) => `export const STATE = ${JSON.stringify(state, null, 4)};`;
const exportConstant = (name: string, value: string | number | object) => `export const ${name} = ${JSON.stringify(value, null, 4)};`;
const tsTemplate = (state: any) => [
    exportConstant('MASTER_ACCOUNT', {
        SEED: MASTER_ACCOUNT_SEED,
        ADDRESS: libs.crypto.address(MASTER_ACCOUNT_SEED, CHAIN_ID),
        PUBLIC_KEY: libs.crypto.publicKey(MASTER_ACCOUNT_SEED),
        ALIAS: 'master'
    }),
    exportConstant('NODE_URL', NODE_URL),
    exportConstant('CHAIN_ID', CHAIN_ID),
    exportConstant('NETWORK_BYTE', CHAIN_ID.charCodeAt(0)),
    exportConstant('SMART_ASSET_SCRIPT', SMART_ASSET_SCRIPT),
    exportConstant('DAP_SCRIPT', DAP_SCRIPT),
    exportConstant('ACCOUNT_SCRIPT', ACCOUNT_SCRIPT),
    '',
    exportState(state),
].join('\n');

export interface IOptions {
    out: string | undefined;
    config: string;
    mode: 'json' | 'typescript';
}
