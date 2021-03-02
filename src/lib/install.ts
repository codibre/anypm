import { runScript } from './exec';
import { getTypes } from './get-types';
import { getCommand } from './get-command';
import { CommandInfo } from './command-info';
import { manageLocks } from './manage-locks';
import { prepareManager } from './prepare-manager';

interface InstallOptions {
	keepLock: boolean;
	saveDev: boolean;
}

function mountInstall(
	command: string,
	saveDev: boolean,
	packages: string[],
): CommandInfo {
	const args = ['install'];
	if (saveDev) {
		args.push('-D');
	}
	args.push(...packages);
	return [command, args];
}

export async function install(packages: string[], options: InstallOptions) {
	const { hasPNPM, command } = await getCommand();
	return runScript(async function* (): AsyncIterable<[string, string[]]> {
		if (packages.length === 0 || options.keepLock) {
			yield* prepareManager(hasPNPM);
		}

		yield mountInstall(command, options.saveDev, packages);

		const types = await getTypes(packages);

		if (types.length > 0) {
			yield mountInstall(command, true, types);
		}

		yield* manageLocks(hasPNPM, options);
	});
}
