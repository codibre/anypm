import { CommandInfo } from './command-info';
import { existsSync } from 'fs';

export function* prepareManager(hasPNPM: boolean): Iterable<CommandInfo> {
	if (hasPNPM && existsSync(`${process.cwd()}/package-lock.json`)) {
		yield ['pnpm', ['import']];
	}
}
