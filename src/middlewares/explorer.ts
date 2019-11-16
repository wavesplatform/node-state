import { NODE_URL, WAVES_EXPLORER_PORT } from '../constants';
import { run } from '../docker';

const EXPLORER_IMAGE = 'wavesplatform/explorer';

export default async (ctx: any, next: any) => {
  run(
    [
      '--rm',
      '-e', `API_NODE_URL=${NODE_URL}`,
      '-e', `NODE_LIST=${NODE_URL}`,
      '-p', `${WAVES_EXPLORER_PORT}:8080`,
    ],
    EXPLORER_IMAGE
  );

  next();
};
