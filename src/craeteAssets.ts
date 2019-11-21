import { TAssetsResponse, IAsset } from './interface';
import { CHAIN_ID, MASTER_ACCOUNT_SEED, SMART_ASSET_SCRIPT } from './constants';
import { broadcastAndWait } from './utils';
import { issue } from '@waves/waves-transactions';
import console from './console';


export default function <ASSETS extends Record<string, IAsset>>(assets: ASSETS): TAssetsResponse<ASSETS> {
  return Promise.all(Object.entries(assets).map(async ([key, asset]) => {
    console.log(`Create asset ${key}`);

    const tx = issue({
      chainId: CHAIN_ID,
      script: typeof asset.script === 'boolean' ? SMART_ASSET_SCRIPT : asset.script,
      name: asset.name,
      description: asset.description || `${asset.name} description`,
      reissuable: asset.reissuable || false,
      quantity: asset.quantity || 1000000 * Math.pow(10, 8),
      decimals: typeof asset.decimals === 'number' && asset.decimals >= 0 ? asset.decimals : 8
    }, MASTER_ACCOUNT_SEED);

    await broadcastAndWait(tx);

    return { [key]: tx };
  }))
  .then(list =>
    list.reduce((acc, item) => Object.assign(acc, item), Object.create(null))) as any;
}
