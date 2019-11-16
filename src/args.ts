import { options } from 'yargs';
import console from './console';

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
    }
}).argv;

export const out = data.out;
export const config = data.config;
export const mode = data.mode as 'json' | 'typescript';
export const upNode = data.upNode;
export const upExplorer = data.upExplorer;
export const upDataService = data.upDataService;
export const runTests = data.runTests;
console.level = data.verbose ? 'verbose' : 'errors';
