import { getTypes } from './get-types';
import { getCommand } from './get-command';
import { manageLocks } from './manage-locks';
import { prepareManager } from './prepare-manager';
import { mountNpmCommand } from './mount-npm-command';
import { BaseOptions, prepareOptions } from './prepare-options';
import { properHoist } from './proper-hoist';

interface InstallOptions extends BaseOptions {
	saveDev: boolean;
	global?: boolean;
}

const ARG0 = 'install';

export async function* install(
	packages: string[],
	informedOptions: InstallOptions,
) {
	const options = prepareOptions(informedOptions);
	const { hasCommand, command } = await getCommand();
	yield* prepareManager(hasCommand, packages.length === 0);
	const hasPackages = packages.length > 0;
	if (options.global) {
		packages.unshift('-g');
	}
	packages.unshift(properHoist);

	yield mountNpmCommand(command, ARG0, packages, options.saveDev);

	if (hasPackages) {
		const types = await getTypes(packages);

		if (types.length > 0) {
			types.unshift(properHoist);
			yield mountNpmCommand(command, ARG0, types, true);
		}
	}

	yield* manageLocks(hasCommand, options);
}
