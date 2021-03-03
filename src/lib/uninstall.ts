import { getCommand } from './get-command';
import { getTypes } from './get-types';
import { manageLocks } from './manage-locks';
import { mountNpmCommand } from './mount-npm-command';
import { prepareManager } from './prepare-manager';

export interface UninstallOptions {
	keepLock: boolean;
}

const ARG0 = 'uninstall';

export async function* uninstall(
	packages: string[],
	options: UninstallOptions,
) {
	const { hasPNPM, command } = await getCommand();
	yield* prepareManager(hasPNPM);
	const types = await getTypes(packages);
	yield mountNpmCommand(command, ARG0, [...packages, ...types]);
	yield* manageLocks(hasPNPM, options);
}
