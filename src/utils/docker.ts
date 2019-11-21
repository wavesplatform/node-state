import { exec, run as utilsRun } from '../utils';
import console from './console';


export function remove(image: string): Promise<void> {
    return stats(['-a']).then(list => {
        const args = list.filter(item => item.image === image)
            .map(item => item.id);

        if (!args.length) {
            return void 0;
        }

        return exec('docker', ['rm', ...args])
            .then(console.log);
    });
}

export function stop(image: string): Promise<void> {
    return stats().then(list => {
        const args = list.filter(item => item.image === image)
            .map(item => item.id);

        if (!args.length) {
            return void 0;
        }

        return exec('docker', ['stop', ...args])
            .then(console.log);
    });
}

export function isRunImage(image: string): Promise<boolean> {
    return stats().then(list => list.filter(item => item.image === image).length !== 0);
}

export function run(args: Array<string>, image: string) {
    return stop(image).then(() => remove(image))
        .then(() => utilsRun('docker', ['run', ...args, image]));
}

export function stats(flags: Array<'-a'> = []): Promise<Array<IImageInfo>> {
    return exec('docker', ['ps', ...flags]).then(message => {
        return message
            .split('\n')
            .filter(Boolean)
            .slice(1)
            .map(line => line.split(/\s\s\s+/))
            .map(([id, image, command]) => ({ id, image, command }));
    });
}

interface IImageInfo {
    id: string;
    image: string;
    command: string;
}


