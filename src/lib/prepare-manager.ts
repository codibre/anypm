import { CommandInfo } from './command-info';
import { dropNodeModules } from './drop-node-modules';
import { hasNoPackageLock } from './has-no-package-lock';

export function* prepareManager(hasPNPM: boolean): Iterable<CommandInfo> {
	if (hasPNPM) {
		if (hasNoPackageLock()) {
			console.info('Generating package-lock.json...');
			yield ['npm', ['i']];
		}
		yield* dropNodeModules();
	}
}
