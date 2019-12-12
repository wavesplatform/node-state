import { alias, data, libs, nodeInteraction, setScript, transfer } from '@waves/waves-transactions';
import { MASTER_ACCOUNT_SEED } from '../constants';
import { broadcastAndWait } from '../utils';
import { IAccount, IAsset, TAccountsResponse, TAssetsResponse } from '../interface';

export default async <STATE_ACCOUNTS extends Record<string, IAccount<{}>>,
    ASSETS extends TAssetsResponse<Record<string, IAsset>>,
    ACCOUNTS extends TAccountsResponse<Record<string, IAsset>, Record<string, IAccount<Record<string, IAsset>>>>>
(stateAccounts: STATE_ACCOUNTS, assets: ASSETS, accounts: ACCOUNTS): Promise<any> => {
    await Promise.all(Object.entries(stateAccounts).map(async ([key, account]): Promise<any> => {
        if (account.balance) {
            await Promise.all(Object.entries(account.balance).map(async ([name, count]) => {
                await setBalance(accounts[key].address, count as number, assets[name].id);
            }));
        }
    }))
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
