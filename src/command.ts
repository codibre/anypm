#!/usr/bin/env node
import { mountNpmCommand } from './lib/mount-npm-command';
import { spawn } from 'child_process';

const COMMAND_POSITION = 2;
const ARGS_POSITION = 3;
const version = Number(/v(\d+)\..+/.exec(process.version)![1]);
const MINIMAL_VERSION = 10;

if (version < MINIMAL_VERSION) {
	const [cmd, args] = mountNpmCommand(
		'npm',
		process.argv[COMMAND_POSITION],
		process.argv.slice(ARGS_POSITION),
	);

	spawn(cmd, args, {
		stdio: [process.stdin, process.stdout, process.stderr],
	}).once('exit', process.exit);
} else {
	require('./index');
}
