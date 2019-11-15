import { broadcast, waitForTx } from '@waves/waves-transactions';
import { NODE_URL } from './constants';


export async function broadcastAndWait(tx: any): Promise<any> {
    try {
        await broadcast(tx, NODE_URL);
        await waitForTx(tx.id, { apiBase: NODE_URL });
    } catch (e) {
        console.error(`Can't send transaction! ${JSON.stringify(tx, null, 4)}`);
    }
}
