import { NODE_API_PORT, DOCKER_NETWORK } from '../constants';
import { run } from '../utils/docker';

const IMAGE = 'wavesplatform/blockchain-postgres-sync';

export default async (ctx: any, next: any) => {
  const crawler = await run(
    [
      '--rm',
      '-e', `NODE_ADDRESS=node:${NODE_API_PORT}`,
      '-e', 'PGHOST=postgres',
      '-e', 'PGPORT=5432',
      '-e', 'PGDATABASE=blockchain',
      '-e', 'PGUSER=postgres',
      '-e', 'PGPASSWORD=postgres',
      '-e', 'MIGRATE=true',
      '--name=crawler',
      `--network=${DOCKER_NETWORK}`,
    ],
    IMAGE
  );

  crawler.on('message', message => {
    console.log(`DataService Crawler: ${message}`);
  })

  next();
};
