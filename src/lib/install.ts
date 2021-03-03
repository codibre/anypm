import { getTypes } from './get-types';
import { getCommand } from './get-command';
import { manageLocks } from './manage-locks';
import { prepareManager } from './prepare-manager';
import { mountNpmCommand } from './mount-npm-command';

interface InstallOptions {
	keepLock: boolean;
	saveDev: boolean;
}

const ARG0 = 'install';

export async function* install(packages: string[], options: InstallOptions) {
	const { hasPNPM, command } = await getCommand();
	if (packages.length === 0 || options.keepLock) {
		yield* prepareManager(hasPNPM);
	}

	yield mountNpmCommand(command, ARG0, packages, options.saveDev);

	if (packages.length > 0) {
		const types = await getTypes(packages);

		if (types.length > 0) {
			yield mountNpmCommand(command, ARG0, types, true);
		}
	}

	yield* manageLocks(hasPNPM, options);
}
