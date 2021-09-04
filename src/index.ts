#!/usr/bin/env node
import { program } from 'commander';
import { audit } from './lib/audit';
import { ci } from './lib/ci';
import { CommandInfo } from './lib/command-info';
import { getNpm } from './lib/get-npm';
import { install } from './lib/install';
import { mountNpmCommand } from './lib/mount-npm-command';
import { replaceNpm } from './lib/replace-npm';
import { runScriptFactory } from './lib/run-script-factory';
import { uninstall } from './lib/uninstall';
import { nvmrc } from './lib/nvmrc';

const knownCommands = [
	'install',
	'i',
	'uninstall',
	'un',
	'ci',
	'help',
	'audit',
	'replace',
	'nvmrc',
];
const COMMAND_POSITION = 2;
const ARGS_POSITION = 3;

if (!knownCommands.includes(process.argv[COMMAND_POSITION])) {
	console.info(`Passing ${process.argv[COMMAND_POSITION]} to npm...`);
	runScriptFactory(async function* (): AsyncIterable<CommandInfo> {
		yield mountNpmCommand(
			await getNpm(),
			process.argv[COMMAND_POSITION],
			process.argv.slice(ARGS_POSITION),
		);
	})();
} else {
	program
		.command('install [packages...]')
		.option(
			'-k, --keep-lock',
			'Keep the lock file from your favorite package manager',
		)
		.option('-D, --save-dev', 'Install as devDependency')
		.option('-g, --global', 'Install globally')
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
		.option('-D, --save-dev', 'Install as devDependency')
		.option('-g, --global', 'Install globally')
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
		.command('audit')
		.description('Audit your dependencies looking for vulnerabilities')
		.action(runScriptFactory(audit))
		.command('fix', 'Fix found vulnerabilities')
		.option(
			'-f, --force',
			'Force fix found vulnerabilities (even major versions)',
		);
	program
		.command('replace')
		.description('Replace npm command for anypm')
		.action(replaceNpm);
	program
		.command('nvmrc')
		.description(
			'Proxy for nvm command which automatic set node for .nvmrc informed version and replace npm with anypm',
		)
		.action(runScriptFactory(nvmrc));
	program
		.command('help', { isDefault: true })
		.description('show help information')
		.action(program.help.bind(program));

	program.version(process.env.NPM_PACKAGE_VERSION!);
	program.parse(process.argv);
}
