import { exec } from 'child_process';
import { DOCKER_NETWORK } from '../constants';

const checkDockerNetworkCommand = [
  'docker', 'network', 'inspect', DOCKER_NETWORK, '>/dev/null', '2>&1',
  '||',
  'docker', 'network', 'create', DOCKER_NETWORK,
].join(' ');

export default async (ctx: any, next: any) => {
  await new Promise(resolve => {
    exec(checkDockerNetworkCommand, () => {
      console.log('Docker network created (or reused): ', DOCKER_NETWORK);
      resolve();
    });
  });

  next();
};
