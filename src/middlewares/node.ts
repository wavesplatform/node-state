import { CHAIN_ID, DOCKER_NETWORK, MASTER_ACCOUNT_SEED, NODE_API_PORT, NODE_URL } from '../constants';
import { isRunImage, remove, run, stop } from '../utils/docker';
import { image } from '../args';

const NODE_IMAGE = image;

export default async (ctx: any, next: any) => {
    console.info(`NODE_URL ${NODE_URL}`);
    console.info(`MASTER_ACCOUNT_SEED ${MASTER_ACCOUNT_SEED}`);
    console.info(`CHAIN_ID ${CHAIN_ID}`);

    const state = await isRunImage(NODE_IMAGE);

    if (state) {
        await stop(NODE_IMAGE);
        await remove(NODE_IMAGE);
    }
    const node = await run(
        [
            '--rm',
            '-p', `${NODE_API_PORT}:6869`,
            `--network=${DOCKER_NETWORK}`,
            '--name=node',
        ],
        NODE_IMAGE
    );

    try {
        await new Promise<void>(resolve => {
            node.stdout.on('data', chunk => {
                const message = String(chunk);
                if (message.includes('REST API was bound')) {
                    console.info('REST API was bound');
                    resolve();
                }
            });
        });

        await next();
    } finally {
        await stop(NODE_IMAGE);
        await remove(NODE_IMAGE);
    }

};
