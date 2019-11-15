import { IAsset, IAccount, TAssetsResponse, TAccountsResponse } from './interface';
import { libs } from '@waves/waves-transactions';
import { CHAIN_ID, MASTER_ACCOUNT_SEED, ACCOUNT_SCRIPT, DAP_SCRIPT } from './constants';
import { broadcastAndWait } from './utils';
import { transfer, setScript, alias } from '@waves/waves-transactions';


export default function <ASSETS extends Record<string, IAsset>, ACCOUNTS extends Record<string, IAccount<ASSETS>>>(accounts: ACCOUNTS, assets: TAssetsResponse<ASSETS>): TAccountsResponse<ASSETS, ACCOUNTS> {
    return Promise.all(Object.entries(accounts).map(async ([key, account]) => {
        const seed = account.seed || libs.crypto.randomSeed();
        const address = libs.crypto.address(seed, CHAIN_ID);
        const publicKey = libs.crypto.publicKey(seed);
        const userAlias = account.alias ?
            typeof account.alias === 'string' ? account.alias : `${key}@${Date.now()}`.toLocaleLowerCase()
            : undefined;

        console.log(`Add account ${key} ${address}`);

        const balanceTx = transfer({
            recipient: address,
            amount: 100 * Math.pow(10, 8)
        }, MASTER_ACCOUNT_SEED);

        await broadcastAndWait(balanceTx);

        if (account.script) {
            const script = typeof account.script === 'boolean' ? ACCOUNT_SCRIPT : account.script === 'dApp' ? DAP_SCRIPT : account.script;

            const tx = setScript({
                chainId: CHAIN_ID,
                script,
                additionalFee: 0.004 * Math.pow(10, 8)
            }, seed);

            await broadcastAndWait(tx);
        }

        if (userAlias) {

            const tx = alias({
                chainId: CHAIN_ID,
                alias: userAlias,
                additionalFee: 0.004 * Math.pow(10, 8)
            }, seed);

            await broadcastAndWait(tx);
        }

        if (account.balance) {
            await Promise.all(Object.entries(account.balance).map(async ([name, count]) => {

                const tx = transfer({
                    recipient: address,
                    amount: count || 1000,
                    assetId: assets[name].id,
                    additionalFee: 0.004 * Math.pow(10, 8)
                }, MASTER_ACCOUNT_SEED);

                await broadcastAndWait(tx);
            }));
        }

        return { [key]: { seed, alias: userAlias, address, publicKey, scripted: !!account.script } };
    }))
        .then(list =>
            list.reduce((acc, item) => Object.assign(acc, item), Object.create(null))) as any;
}
