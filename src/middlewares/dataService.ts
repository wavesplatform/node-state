import { DATA_SERVICE_API_PORT, DOCKER_NETWORK } from '../constants';
import { run } from '../utils/docker';

const IMAGE = 'wavesplatform/data-service';

export default async (ctx: any, next: any) => {
  const dataService = await run(
    [
        '--rm',
        '-e', 'PORT=3000',
        '-e', 'PGHOST=postgres',
        '-e', 'PGPORT=5432',
        '-e', 'PGDATABASE=blockchain',
        '-e', 'PGUSER=postgres',
        '-e', 'PGPASSWORD=postgres',
        '-e', 'DEFAULT_MATCHER=false',
        '-e', 'MATCHER_SETTINGS_URL=',
        '-p', `${DATA_SERVICE_API_PORT}:3000`,
        '--name=data-service',
        `--network=${DOCKER_NETWORK}`,
    ],
    IMAGE
  );

  dataService.on('message', message => {
    console.log(`DataService: ${message}`);
  })

  next();
};
