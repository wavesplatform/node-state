#!/usr/bin/env node

import { spawn, exec } from 'child_process';
import { options } from 'yargs';
import { join } from 'path';
import { NODE_URL } from './constants';


const { out, config, mode, node, explorer, dataService } = options({
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
    dataService: {
        type: 'boolean',
        alias: 'd',
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

const run = (command: string, args: Array<string>) => {

    console.log(`${command} ${args.join(' ')}`);

    const process = spawn(command, args);

    process.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });

    process.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });

    process.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
    });
};

const defaultConfig = join(__dirname, '..', 'config.json');
const apply = () => {
    if (dataService) {
        // const workerDs = spawn('docker-compose', ['up', '-e', `NODE_ADDRESS=${NODE_URL}`], {
        //     cwd: join(__dirname, '..', 'env')
        // });
        //
        // workerDs.stdout.on('data', chunk => {
        //     console.log(`Data Service: ${chunk}`);
        // });
        //
        // workerDs.stdout.on('error', chunk => console.error(String(chunk)));
        // workerDs.stderr.on('error', chunk => console.error(String(chunk)));
        // workerDs.stderr.on('data', chunk => console.error(String(chunk)));
        // workerDs.stderr.on('close', (chunk: any) => console.error(String(chunk)));


        // run('docker', ['network create ds']);

        run('docker', [
            'run',
            '--rm',
            '--name=postgres',
            '-e', 'POSTGRES_USER=postgres',
            '-e', 'POSTGRES_PASSWORD=postgres',
            '-e', 'POSTGRES_DB=blockchain',
            '-p', '5432:5432',
            '--network=ds',
            'postgres:alpine',
        ]);

        setTimeout(() => {
            run('docker', [
                'run',
                '--rm',
                '-e', `NODE_ADDRESS=node:6869`,
                // '-e', `NODE_ADDRESS='nodes.wavesnodes.com'`,
                '-e', 'PGHOST=postgres',
                '-e', 'PGPORT=5432',
                '-e', 'PGDATABASE=blockchain',
                '-e', 'PGUSER=postgres',
                '-e', 'PGPASSWORD=postgres',
                '-e', 'MIGRATE=true',
                '--network=ds',
                'wavesplatform/blockchain-postgres-sync',
            ]);
        }, 5000);
    }

    // write({
    //     config: config ? join(process.cwd(), config) : defaultConfig,
    //     out: join(process.cwd(), out),
    //     mode: mode as 'json' | 'typesctipt'
    // });
};

if (node) {
    const workerNode = spawn('docker', ['run', '-p', '6869:6869', '--network=ds', '--name=node', 'wavesplatform/waves-private-node']);

    workerNode.stdout.on('data', buffer => {
        const message = String(buffer);
        // console.log(`Worker Node: ${message}`);
        if (message.includes('REST API was bound')) {
            apply();
        }
    });

    workerNode.stdout.on('error', chunk => console.error(String(chunk)));
    workerNode.stderr.on('error', chunk => console.error(String(chunk)));
    workerNode.stderr.on('data', chunk => console.error(String(chunk)));
    workerNode.stderr.on('close', (chunk: any) => console.error(String(chunk)));
} else {
    apply();
}

if (explorer) {
    const workerNode = spawn('docker', ['run', '-e', `API_NODE_URL=${NODE_URL}`, '-e', `NODE_LIST=${NODE_URL}`, '-p', '3000:8080', 'wavesplatform/explorer']);

    workerNode.stdout.on('data', data => {
        console.log(`Worker Explorer: ${data}`);
    });
}
