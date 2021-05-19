import { IAccount, IAsset, TAccountsResponse, TAssetsResponse } from '../interface';
import { alias, data, libs, nodeInteraction, setScript, transfer } from '@waves/waves-transactions';
import { ACCOUNT_SCRIPT, CHAIN_ID, DAP_SCRIPT, MASTER_ACCOUNT_SEED, NODE_URL } from '../constants';
import { broadcastAndWait } from '../utils';
import console from '../utils/console';


export default function <ASSETS extends Record<string, IAsset>, ACCOUNTS extends Record<string, IAccount<ASSETS>>>(accounts: ACCOUNTS): TAccountsResponse<ASSETS, ACCOUNTS> {
    return Promise.all(Object.entries(accounts).map(async ([key, account]) => {

        const seed = account.seed || libs.crypto.randomSeed();
        const address = libs.crypto.address(seed, CHAIN_ID);
        const publicKey = libs.crypto.publicKey(seed);
        const userAlias = account.alias ?
            typeof account.alias === 'string' ? account.alias : `${key}@${Date.now()}`.toLocaleLowerCase()
            : undefined;

        console.log(`Add account ${key} ${address}`);

        await setBalance(address, 100 * Math.pow(10, 8));

        if (userAlias) {
            const tx = alias({
                chainId: CHAIN_ID,
                alias: userAlias,
                additionalFee: 0.001 * Math.pow(10, 8)
            }, seed);

            await broadcastAndWait(tx);
        }

        if (account.data) {
            await Promise.all(Object.entries(account.data).map(async ([key, { type, value }]) => {
                const tx = data({
                    chainId: CHAIN_ID,
                    data: [{ key, type, value }]
                } as any, seed);

                await broadcastAndWait(tx);
            }));
        }

        if (account.script) {
            const script = typeof account.script === 'boolean' ? ACCOUNT_SCRIPT : account.script === 'dApp' ? DAP_SCRIPT : account.script;
            await addScript(seed, script);
        }

        const { available } = await nodeInteraction.balanceDetails(address, NODE_URL);
        const toSend = 100 * Math.pow(10, 8) - (+available);

        await setBalance(address, toSend);

        return {
            [key]: {
                seed,
                alias: userAlias,
                address, publicKey,
                scripted: !!account.script,
                data: account.data
            }
        };
    }))
        .then(list =>
            list.reduce((acc, item) => Object.assign(acc, item), Object.create(null))) as any;
}

async function setBalance(recipient: string, amount: number, assetId?: string | undefined) {
    const balanceTx = transfer({
        recipient,
        amount,
        assetId,
        additionalFee: 0.004 * Math.pow(10, 8)
    }, MASTER_ACCOUNT_SEED);

    await broadcastAndWait(balanceTx);
}

async function addScript(seed: string, script: string) {
    const tx = setScript({
        chainId: CHAIN_ID,
        script,
        additionalFee: 0.004 * Math.pow(10, 8)
    }, seed);

    await broadcastAndWait(tx);
}
