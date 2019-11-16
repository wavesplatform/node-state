#!/usr/bin/env node

import { middlewareWithContext } from './middleware';

import checkDockerNetwork from './middlewares/checkDockerNetwork';
import node from './middlewares/node';
import explorer from './middlewares/explorer';
import postgres from './middlewares/postgres';
import crawler from './middlewares/crawler';
import dataService from './middlewares/dataService';
import apply from './middlewares/apply';

import { upNode, upExplorer, upDataService } from './args';

const middlewares = [checkDockerNetwork];

if (upNode) middlewares.push(node);
if (upExplorer) middlewares.push(explorer);
if (upDataService) middlewares.push(postgres, crawler, dataService);

middlewares.push(apply);

middlewareWithContext(...middlewares)({});
