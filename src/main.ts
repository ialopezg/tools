import { Command, Option } from 'commander';
import * as dotenv from 'dotenv';

dotenv.config();

import { exportData, exportTable } from './helpers/export.helper';

const program = new Command();
program
    .version(process.env.npm_package_version || '1.0.0')
    .name(process.env.npm_package_name || 'tools')
    .description(process.env.npm_package_description || 'CLI Database Tools and Utilities for NodeJS')
program
    .addOption(
        new Option('-e, --export <type>', 'Export database tables')
            .choices(['all', 'schema', 'content'])
            .default('all')
    )
    .addOption(
        new Option('-t, --table [table]', 'Table name to be exported')
            .default('all')
    )
    .addOption(
        new Option('-o, --owner [owner]', 'Database objects owner name')
            .default('NKW')
    )
    .addOption(new Option('-c, --criteria [string]', 'Database objects owner name'))
    .parse(process.argv);

const options = program.opts();

if (options.table === 'all') {
    exportData(options.owner);
} else {
    exportTable(options.owner, options.table, options.criteria)
}
