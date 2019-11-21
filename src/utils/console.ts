import { blue, green, yellow, red } from 'cli-color';

module log {
    const call = (color: (...args: Array<any>) => string) => (item: any) => color(item);

    export let level: 'verbose' | 'errors' = 'errors';

    export function log(...args: Array<any>) {
        if (level === 'verbose') {
            console.log(...args.map(call(green)));
        }
    }

    export function info(...args: Array<any>) {
        console.info(...args.map(call(blue)));
    }

    export function warn(...args: Array<any>) {
        console.warn(...args.map(call(yellow)));
    }

    export function error(...args: Array<any>) {
        console.error(...args.map(call(red)));
    }
}

export default log;