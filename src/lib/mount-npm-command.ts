import { CommandInfo } from './command-info';
import { Command } from './config';

export function mountNpmCommand(
	command: Command,
	arg0: string,
	packages: string[],
	saveDev?: boolean,
): CommandInfo {
	const args = [arg0];
	if (saveDev) {
		args.push('-D');
	}
	args.push(...packages);
	return [command, args];
}
