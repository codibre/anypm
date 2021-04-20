import { getCommand } from './get-command';
import { manageLocks } from './manage-locks';
import { mountNpmCommand } from './mount-npm-command';
import { BaseOptions, prepareOptions } from './prepare-options';
import { hasNoPackageLock } from './has-no-package-lock';
import { dropNodeModules } from './drop-node-modules';

interface CIOptions extends BaseOptions {}

export async function* ci(informedOptions: CIOptions) {
	if (hasNoPackageLock()) {
		throw Error('Package lock does not exists!');
	}
	yield* dropNodeModules();
	const options = prepareOptions(informedOptions);
	const { hasCommand, command } = await getCommand();
	if (command === 'pnpm') {
		yield mountNpmCommand('pnpm', 'import', []);
		yield mountNpmCommand('pnpm', 'install', ['--frozen-lockfile']);
	} else {
		yield mountNpmCommand('npm', 'ci', []);
	}

	yield* manageLocks(hasCommand, options);
}
