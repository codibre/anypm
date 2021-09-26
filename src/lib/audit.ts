import { mountNpmCommand } from './mount-npm-command';
import { hasNoPackageLock } from './has-no-package-lock';
import { getCommand } from './get-command';
import { manageLocks } from './manage-locks';
import { prepareOptions } from './prepare-options';

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
	const params: string[] = [];
	if (options.fix) {
		params.push('fix');
	}
	if (options.force) {
		params.push('--force');
	}
	yield mountNpmCommand(command, 'audit', params);
	yield* manageLocks(hasCommand, options);
}
