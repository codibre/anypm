import { mountNpmCommand } from './mount-npm-command';
import { hasNoPackageLock } from './has-no-package-lock';
import { getCommand } from './get-command';
import { manageLocks } from './manage-locks';
import { prepareOptions } from './prepare-options';
import { prepareManager } from './prepare-manager';

interface AuditOptions {
	fix?: boolean;
	force?: boolean;
	keepLock?: boolean;
}

export async function* audit(informedOptions: AuditOptions) {
	if (hasNoPackageLock()) {
		throw Error('Package lock does not exists!');
	}
	const options = prepareOptions(informedOptions);
	const { hasCommand, command } = await getCommand();
	yield* prepareManager(hasCommand);
	const params: string[] = [];
	if (options.fix) {
		params.push(hasCommand ? 'fix' : '--fix');
	}
	if (options.force) {
		params.push('--force');
	}
	yield mountNpmCommand(command, 'audit', params);
	yield* manageLocks(hasCommand, options);
}
