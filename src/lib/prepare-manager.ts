import { CommandInfo } from './command-info';
import { existsSync } from 'fs';

export function* prepareManager(hasPNPM: boolean): Iterable<CommandInfo> {
	if (hasPNPM) {
		if (!existsSync(`${process.cwd()}/package-lock.json`)) {
			yield ['npm', ['i']];
		}
		yield ['npx', ['del-cli', 'node_modules']];
	}
}
