import { CommandInfo } from './command-info';
import { hasNoPackageLock } from './has-no-package-lock';

export function* prepareManager(hasPNPM: boolean): Iterable<CommandInfo> {
	if (hasPNPM) {
		if (hasNoPackageLock()) {
			yield ['npm', ['i']];
		}
		yield ['npx', ['del-cli', 'node_modules']];
	}
}
