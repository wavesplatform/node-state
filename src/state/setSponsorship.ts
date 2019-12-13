import { TAssetsResponse, IAsset, IAccount, TAccountsResponse } from '../interface';
import { MASTER_ACCOUNT_SEED } from '../constants';
import { broadcastAndWait } from '../utils';
import { sponsorship } from '@waves/waves-transactions';
import console from '../utils/console';

export default function <STATE_ASSETS extends Record<string, IAsset>,
    ASSETS extends TAssetsResponse<Record<string, IAsset>>,
    ACCOUNTS extends TAccountsResponse<Record<string, IAsset>, Record<string, IAccount<Record<string, IAsset>>>>>
(stateAssets: STATE_ASSETS, assets: ASSETS, accounts: ACCOUNTS): any {
    const sponsorshipAssets: STATE_ASSETS = Object.keys(stateAssets).reduce((acc, assetsKey) => (
        stateAssets[assetsKey].sponsorship ? Object.assign(acc, { [assetsKey]: stateAssets[assetsKey] } ) : acc
    ), Object.create(null));

    return Promise.all(Object.entries(sponsorshipAssets).map(async ([key, asset]) => {
        console.log(`${key} sponsorship ${asset.name}`);

        const tx = sponsorship({
            assetId: assets[key].id,
            minSponsoredAssetFee: 1,
        }, asset.owner ? accounts[asset.owner].seed : MASTER_ACCOUNT_SEED);

        await broadcastAndWait(tx);


        return { [key]: tx };
    }))
        .then(list =>
            list.reduce((acc, item) => Object.assign(acc, item), Object.create(null))) as any;
}
