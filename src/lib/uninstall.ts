import { CommandInfo } from './command-info';
import { runScript } from './exec';
import { getCommand } from './get-command';
import { getTypes } from './get-types';
import { manageLocks } from './manage-locks';
import { prepareManager } from './prepare-manager';

export interface UninstallOptions {
	keepLock: boolean;
}

function mountUninstall(command: string, packages: string[]): CommandInfo {
	return [command, ['uninstall', ...packages]];
}

export async function uninstall(packages: string[], options: UninstallOptions) {
	const { hasPNPM, command } = await getCommand();
	if (packages.length === 0) {
		throw new Error('You need to inform packages for uninstalling, champs!');
	}
	return runScript(async function* (): AsyncIterable<[string, string[]]> {
		yield* prepareManager(hasPNPM);
		const types = await getTypes(packages);
		yield mountUninstall(command, [...packages, ...types]);
		yield* manageLocks(hasPNPM, options);
	});
}
