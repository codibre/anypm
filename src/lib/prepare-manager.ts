import { CommandInfo } from './command-info';
// import { existsSync } from 'fs';

// TODO: uncomment when https://github.com/pnpm/pnpm/issues/3263 is fixed
export function* prepareManager(_hasPNPM: boolean): Iterable<CommandInfo> {
	// if (hasPNPM) {
	// 	if (!existsSync(`${process.cwd()}/package-lock.json`)) {
	// 		yield ['npm', ['i']];
	// 		yield ['npx', ['del-cli', 'node_modules']];
	// 	}
	// 	yield ['pnpm', ['import']];
	// }
}
