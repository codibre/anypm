import { sync } from 'read-pkg';
import { getCommand } from './get-command';
import { getTypes } from './get-types';
import { manageLocks } from './manage-locks';
import { mountNpmCommand } from './mount-npm-command';
import { prepareManager } from './prepare-manager';
import { BaseOptions, prepareOptions } from './prepare-options';

export interface UninstallOptions extends BaseOptions {}

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
	yield* prepareManager(hasPNPM);
	const types = await getTypes(filteredPackages, ref);
	yield mountNpmCommand(command, ARG0, [...filteredPackages, ...types]);
	yield* manageLocks(hasPNPM, options);
}
