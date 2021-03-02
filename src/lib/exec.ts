import { exec } from 'child_process';
import { promisify } from 'util';

export const runCommand = (promisify(exec) as unknown) as (
	command: string,
) => Promise<string>;

export async function runScript(commands: () => AsyncIterable<string>) {
	for await (const command of commands()) {
		await runCommand(command);
	}
}
