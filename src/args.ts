import { options } from 'yargs';
import console from './utils/console';

const data = options({
    out: {
        type: 'string',
        alias: 'o'
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
    upNode: {
        type: 'boolean',
        alias: 'n',
        default: false
    },
    upDataService: {
        type: 'boolean',
        alias: 'd',
    },
    upExplorer: {
        type: 'boolean',
        alias: 'e',
        default: false
    },
    runTests: {
        type: 'boolean',
        alias: 'r'
    },
    verbose: {
        type: 'boolean'
    },
    image: {
        type: 'string',
        alias: 'i',
        default: 'wavesplatform/waves-private-node'
    }
}).parseSync();

export const out = data.out;
export const config = data.config;
export const mode = data.mode as 'json' | 'typescript';
export const upNode = data.upNode;
export const runTests = data.runTests
export const image = data.image
console.level = data.verbose ? 'verbose' : 'errors';
