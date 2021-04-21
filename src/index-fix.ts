#!/usr/bin/env node
import { program } from 'commander';
import { auditFix } from './lib/audit-fix';
import { runScriptFactory } from './lib/run-script-factory';
import { constant } from 'is-this-a-pigeon';

program
	.option(
		'-f, --force',
		'Force fix found vulnerabilities (even major versions)',
	)
	.action(runScriptFactory(auditFix))
	.description(
		'Audit your dependencies looking for vulnerabilities and fix them',
	)
	.configureHelp({
		commandUsage: constant('audit fix [options]'),
	});

program.parse(process.argv);
