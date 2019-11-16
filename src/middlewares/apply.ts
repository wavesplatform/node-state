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
  } else {
    // TODO add check test command
    const child = runCommand('npm', ['run', 'testCommand'], {
      log: console.warn,
    });

    child.on('exit', code => {
      process.exit(code || 0);
    });

    next();
  }
};
