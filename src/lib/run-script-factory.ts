import { spawn } from 'child_process';
import { CommandInfo } from './command-info';

export function runScriptFactory<T extends Array<unknown>>(
	commands: (...args: T) => AsyncIterable<CommandInfo> | Iterable<CommandInfo>,
) {
	return async (...params: T) => {
		for await (const [command, args] of commands(...params)) {
			await new Promise<void>((resolve, reject) => {
				const child = spawn(command, args, {
					stdio: [process.stdin, process.stdout, process.stderr],
				});
				child.once('exit', (x) => (x ? reject(x) : resolve()));
			});
		}
	};
}
