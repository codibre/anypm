#!/usr/bin/env node
import { program } from 'commander';
import { install } from './lib/install';
import { uninstall } from './lib/uninstall';

program
	.command('install [packages...]')
	.option(
		'-k, --keep-lock',
		'Keep the lock file from your favorite package manager',
	)
	.option('-D, --save-dev', 'Install as devDependency')
	.alias('i')
	.description(
		'Install the informed packages or follows the package.json if no package is informed using your favorite package manager',
	)
	.action(install);
program
	.command('uninstall <packages...>')
	.option(
		'-k, --keep-lock',
		'Keep the lock file from your favorite package manager',
	)
	.alias('un')
	.description('Removes the package from your project')
	.action(uninstall);
program
	.command('help', { isDefault: true })
	.description('show help information')
	.action(program.help.bind(program));

program.version(process.env.NPM_PACKAGE_VERSION!);

program.parse(process.argv);
