import { sync } from 'read-pkg';
import { getCommand } from './get-command';
import { getTypes } from './get-types';
import { manageLocks } from './manage-locks';
import { mountNpmCommand } from './mount-npm-command';
import { BaseOptions, prepareOptions } from './prepare-options';
import { pnpmArgs } from './proper-hoist';

export interface UninstallOptions extends BaseOptions {
	saveDev?: boolean;
	global?: boolean;
}

const ARG0 = 'uninstall';

export async function* uninstall(
	packages: string[],
	informedOptions: UninstallOptions,
) {
	const options = prepareOptions(informedOptions);
	const { hasCommand: hasPNPM, command } = await getCommand();
	const currentPackages = sync();
	const ref = new Set([
		...Object.keys(currentPackages.dependencies || {}),
		...Object.keys(currentPackages.devDependencies || {}),
	]);
	const filteredPackages = packages.filter((x) => ref.has(x));
	if (options.global) {
		packages.unshift('-g');
	}
	const types = await getTypes(filteredPackages, ref);
	const args = [...filteredPackages, ...types];
	yield mountNpmCommand(command, ARG0, args, options.saveDev);
	yield* manageLocks(hasPNPM, options);
}
