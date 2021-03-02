import { CommandInfo } from './command-info';

export function* prepareManager(hasPNPM: boolean): Iterable<CommandInfo> {
	if (hasPNPM) {
		yield ['pnpm', ['import']];
	}
}
