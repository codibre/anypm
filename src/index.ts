#!/usr/bin/env node
import { program } from 'commander';
import { ci } from './lib/ci';
import { install } from './lib/install';
import { runScriptFactory } from './lib/run-script-factory';
import { uninstall } from './lib/uninstall';

program
	.command('install [packages...]')
	.option(
		'-k, --keep-lock',
		'Keep the lock file from your favorite package manager',
	)
	.option('-D, --save-dev', 'Install as devDependency')
	.option('-g', '--global', 'Install globally')
	.alias('i')
	.description(
		'Install the informed packages or follows the package.json if no package is informed using your favorite package manager',
	)
	.action(runScriptFactory(install));
program
	.command('uninstall <packages...>')
	.option(
		'-k, --keep-lock',
		'Keep the lock file from your favorite package manager',
	)
	.option('-g', '--global', 'Install globally')
	.alias('un')
	.description('Removes the package from your project')
	.action(runScriptFactory(uninstall));
program
	.command('ci')
	.option(
		'-k, --keep-lock',
		'Keep the lock file from your favorite package manager',
	)
	.description('Install respecting package-lock')
	.action(runScriptFactory(ci));
program
	.command('help', { isDefault: true })
	.description('show help information')
	.action(program.help.bind(program));

program.version(process.env.NPM_PACKAGE_VERSION!);

program.parse(process.argv);
