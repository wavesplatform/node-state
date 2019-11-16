#!/usr/bin/env node

import { join } from 'path';
import { CHAIN_ID, MASTER_ACCOUNT_SEED, NODE_URL } from './constants';
import { write } from './index';
import console from './console';
import { isRunImage, run } from './docker';
import { config, mode, out, upExplorer, upNode } from './args';


const NODE_IMAGE = 'wavesplatform/waves-private-node';
const EXPLORER_IMAGE = 'wavesplatform/explorer';
const DEFAULT_CONFIG = join(__dirname, '..', 'config.json');

const apply = () => {
    // if (dataService) {
    //     run('docker', [
    //         'run',
    //         '--rm',
    //         '--name=postgres',
    //         '-e', 'POSTGRES_USER=postgres',
    //         '-e', 'POSTGRES_PASSWORD=postgres',
    //         '-e', 'POSTGRES_DB=blockchain',
    //         '-p', '5432:5432',
    //         '--network=ds',
    //         'postgres:alpine',
    //     ]);
    //
    //     setTimeout(() => {
    //         run('docker', [
    //             'run',
    //             '--rm',
    //             '-e', `NODE_ADDRESS=node:6869`,
    //             '-e', 'PGHOST=postgres',
    //             '-e', 'PGPORT=5432',
    //             '-e', 'PGDATABASE=blockchain',
    //             '-e', 'PGUSER=postgres',
    //             '-e', 'PGPASSWORD=postgres',
    //             '-e', 'MIGRATE=true',
    //             '--network=ds',
    //             'wavesplatform/blockchain-postgres-sync',
    //         ]);
    //     }, 5000);
    // }

    return write({
        config: config ? join(process.cwd(), config) : DEFAULT_CONFIG,
        out: out ? join(process.cwd(), out) : undefined,
        mode
    });
};

if (upNode) {
    console.info(`NODE_URL ${NODE_URL}`);
    console.info(`MASTER_ACCOUNT_SEED ${MASTER_ACCOUNT_SEED}`);
    console.info(`CHAIN_ID ${CHAIN_ID}`);

    run('docker', [
        'run', '-p', '6869:6869',
        '--network=ds', '--name=node'
    ], NODE_IMAGE).then(node => {

        node.stdout.on('data', chunk => {
            const message = String(chunk);
            if (message.includes('REST API was bound')) {
                console.info('REST API was bound');
                return apply();
            }
        });
    });
} else {
    isRunImage(NODE_IMAGE)
        .then(apply, () => Promise.reject('Up the instance of node before create state!'));
}

if (upExplorer) {
    run('docker', [
        'run', '-e', `API_NODE_URL=${NODE_URL}`, '-e', `NODE_LIST=${NODE_URL}`, '-p', '3000:8080'
    ], EXPLORER_IMAGE);
}
