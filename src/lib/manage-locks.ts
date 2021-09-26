import { CommandInfo } from './command-info';
import { UninstallOptions } from './uninstall';

export function* manageLocks(
	hasPNPM: boolean,
	options: UninstallOptions,
): Iterable<CommandInfo> {
	if (hasPNPM) {
		if (!options.keepLock) {
			yield ['rm', ['-rf', 'pnpm-lock.yaml']];
		}

		yield ['npm', ['install', '--package-lock-only', '--ignore-scripts']];
	}
}
