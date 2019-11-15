#!/usr/bin/env node

import { spawn } from 'child_process';
import { options } from 'yargs';
import { join } from 'path';
import { write } from './index';


const { out, config, mode, node, explorer } = options({
    out: {
        type: 'string',
        alias: 'o',
        required: true
    },
    config: {
        type: 'string',
        alias: 'c'
    },
    mode: {
        type: 'string',
        alias: 'm',
        choices: ['json', 'typescript'],
        default: 'json'
    },
    node: {
        type: 'boolean',
        alias: 'n',
        default: false
    },
    explorer: {
        type: 'boolean',
        alias: 'e',
        default: false
    },
    // log: {
    //     type: 'string',
    //     alias: 'l',
    //     choises: ['all', 'state', 'node'],
    //     default: 'all'
    // }
}).argv;

const defaultConfig = join(__dirname, '..', 'config.json');
const apply = () => write({
    config: config ? join(process.cwd(), config) : defaultConfig,
    out: join(process.cwd(), out),
    mode: mode as 'json' | 'typesctipt'
});

if (node) {
    const workerNode = spawn('docker', ['run', '-p', '6869:6869', 'wavesplatform/waves-private-node']);

    workerNode.stdout.on('data', buffer => {
        const message = String(buffer);
        console.log(`Worker Node: ${message}`);
        if (message.includes('REST API was bound')) {
            apply();
        }
    });
} else {
    apply();
}

if (explorer) {
    const workerNode = spawn('docker', ['run', '-e', 'API_NODE_URL=http://localhost:6869', '-e', 'NODE_LIST=http://localhost:6869', '-p', '3000:8080', 'wavesplatform/explorer']);

    workerNode.stdout.on('data', data => {
        console.log(`Worker Explorer: ${data}`);
    });
}
