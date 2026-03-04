import { join } from 'path';
import { write } from '../';
import { run as runCommand } from '../utils';
import { config, mode, out, runTests } from '../args';

const DEFAULT_CONFIG = join(__dirname, '..', '..', 'config.json');

export default async (ctx: any, next: any) => {
  await write({
    config: config ? join(process.cwd(), config) : DEFAULT_CONFIG,
    out: out ? join(process.cwd(), out) : undefined,
    mode,
  });
  
  if (!runTests) {
    return next();
  }

  const npmExecPath = process.env.npm_execpath;
  const command = npmExecPath ? process.execPath : process.platform === 'win32' ? 'npm.cmd' : 'npm';
  const args = npmExecPath ? [npmExecPath, 'run', 'testCommand'] : ['run', 'testCommand'];

  // TODO add check test command
  const child = runCommand(command, args, {
    log: console.warn,
  });

  const exitCode = await new Promise<number>((resolve, reject) => {
    child.on('exit', code => resolve(code || 0));
    child.on('error', reject);
  });

  if (exitCode !== 0) {
    process.exitCode = exitCode;
  }

  return next();
};
