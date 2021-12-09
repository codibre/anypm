import { mountNpmCommand } from './mount-npm-command';
import { hasNoPackageLock } from './has-no-package-lock';
import { getNpm } from './get-npm';

interface AuditOptions {
	fix?: boolean;
	force?: boolean;
}

export async function* audit(options: AuditOptions) {
	if (hasNoPackageLock()) {
		throw Error('Package lock does not exists!');
	}
	const params: string[] = [];
	if (options.fix) {
		params.push('fix');
	}
	if (options.force) {
		params.push('--force');
	}
	yield mountNpmCommand(await getNpm(), 'audit', params);
}
