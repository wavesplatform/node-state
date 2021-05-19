#!/usr/bin/env node

import { middlewareWithContext } from './middleware';

import checkDockerNetwork from './middlewares/checkDockerNetwork';
import node from './middlewares/node';
import apply from './middlewares/apply';

import { upNode} from './args';

const middlewares = [checkDockerNetwork];

if (upNode) middlewares.push(node);

middlewares.push(apply);

middlewareWithContext(...middlewares)({});
