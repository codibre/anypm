#!/usr/bin/env node
import { mountNpmCommand } from './lib/mount-npm-command';
import { spawn } from 'child_process';

const COMMAND_POSITION = 2;
const ARGS_POSITION = 3;

if (process.version < 'v10') {
	const [cmd, args] = mountNpmCommand(
		'npm',
		process.argv[COMMAND_POSITION],
		process.argv.slice(ARGS_POSITION),
	);

	spawn(cmd, args, {
		stdio: [process.stdin, process.stdout, process.stderr],
	}).once('exit', process.exit);
}

require('./index');
