#!/usr/bin/env node

import { Command, Option } from 'commander';
import * as dotenv from 'dotenv';

dotenv.config();

import { execute } from './database/datasource';
import { exportData, exportTable } from './helpers/export.helper';
import { queryBuilder } from './helpers/query-builder.helper';

const program = new Command();
program
  .version(process.env.npm_package_version || '1.0.0')
  .name(process.env.npm_package_name || 'tools')
  .description(process.env.npm_package_description || 'CLI Database Tools and Utilities for NodeJS')
program
  .addOption(
    new Option('-a, --action <type>', 'Runs an action over the database')
      .choices(['export', 'query'])
      .default('query')
  )
  .addOption(new Option('-o, --owner [owner]', 'Database objects owner name').default(''))
  .addOption(
    new Option('-t, --table [table]', 'Table name')
      .default('all'))
      .addOption(
        new Option('--alias [alias]', 'Table name alias')
          .default(''))
  .addOption(
    new Option('-f, --fields [fields]', 'Field names separates by comma')
      .default('*')
  )
  .addOption(new Option('-c, --criteria [string]', 'Database objects owner name'))
  .parse(process.argv);

const options = program.opts();

if (options.action === 'query') {
  if (!options.table || options.table === 'all') {
    throw new Error(`Table name "${options.table}" is invalid in this context!`);
  }
  
  execute(queryBuilder(
    options.fields,
    options.table,
    options.owner,
    options.alias,
    options.criteria
  )).then((result: any) => {
    console.log(result);
  });
}

if (options.action === 'export') {
  if (options.table === 'all') {
    exportData(options.owner);
  } else {
    exportTable(options.owner, options.table, options.criteria)
  }
}
