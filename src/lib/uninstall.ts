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
	// For global uninstalls, don't filter by package.json (remove from global scope)
	const filteredPackages = options.global
		? packages
		: packages.filter((x) => ref.has(x));

	const types = await getTypes(filteredPackages, ref);
	const args = [...filteredPackages, ...types];

	if (options.global) {
		args.unshift('-g');
	} else {
		// Ensure pnpm hoist/config flags are preserved during uninstall
		args.unshift(...pnpmArgs);
	}

	yield mountNpmCommand(command, ARG0, args, options.saveDev);

	if (!options.global) yield* manageLocks(hasPNPM, options);
}
