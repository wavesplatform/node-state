import { broadcast, waitForTx } from '@waves/waves-transactions';
import { NODE_URL } from './constants';
import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
import console from './console';


export async function broadcastAndWait(tx: any): Promise<any> {
    try {
        await broadcast(tx, NODE_URL);
        await waitForTx(tx.id, { apiBase: NODE_URL });
    } catch (e) {
        console.error(`Can't send transaction! ${JSON.stringify(tx, null, 4)}`);
    }
}

export const run = (command: string, args: Array<string>): ChildProcessWithoutNullStreams => {
    console.info(`${command} ${args.join(' ')}`);

    const process = spawn(command, args);

    process.stdout.on('data', data => {
        console.log(String(data));
    });

    process.stderr.on('data', data => {
        console.error(data);
    });

    process.on('close', (code) => {
        console.info(`Child process "${command} ${args.join(' ')}" exited with code ${code}`);
    });

    return process;
};

export const exec = (command: string, args: Array<string>): Promise<string> => {
    console.info(`Exec "${command} ${args.join(' ')}"`);

    let data = '';

    const process = spawn(command, args);

    process.stdout.on('data', chunk => {
        data += chunk;
    });

    process.stderr.on('data', chunk => {
        data += chunk;
    });

    return new Promise((resolve, reject) => {
        process.on('close', code => {
            if (code === 0) {
                resolve(data);
            } else {
                console.error(data);
                reject(`Child process "${command} ${args.join(' ')}" exited with code ${code}`);
            }
        });
    });
};
