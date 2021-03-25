import { sync } from 'read-pkg';
import { getCommand } from './get-command';
import { getTypes } from './get-types';
import { manageLocks } from './manage-locks';
import { mountNpmCommand } from './mount-npm-command';
import { prepareManager } from './prepare-manager';
import { prepareOptions } from './prepare-options';

export interface UninstallOptions {
	keepLock: boolean;
}

const ARG0 = 'uninstall';

export async function* uninstall(
	packages: string[],
	informedOptions: UninstallOptions,
) {
	const options = prepareOptions(informedOptions);
	const { hasCommand: hasPNPM, command } = await getCommand();
	const currentPackages = sync();
	yield* prepareManager(hasPNPM);
	const types = await getTypes(packages, currentPackages.devDependencies);
	yield mountNpmCommand(command, ARG0, [...packages, ...types]);
	yield* manageLocks(hasPNPM, options);
}
