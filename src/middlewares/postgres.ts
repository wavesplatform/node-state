import { DOCKER_NETWORK } from '../constants';
import { run } from '../utils/docker';

const IMAGE = 'postgres:alpine';

export default async (ctx: any, next: any) => {
  const postgres = await run(
    [
      '--rm',
      '-e', 'POSTGRES_USER=postgres',
      '-e', 'POSTGRES_PASSWORD=postgres',
      '-e', 'POSTGRES_DB=blockchain',
      '-p', '5432:5432',
      '--name=postgres',
      `--network=${DOCKER_NETWORK}`,
    ],
    IMAGE
  );

  await new Promise(resolve => {
    postgres.stdout.on('data', chunk => {
        const message = String(chunk);
        // console.log(`Worker PostgreSQL: ${message}`);
        if (message.includes('database system is ready to accept connections')) {
            resolve();
        }
    });
  });

  next();
};
