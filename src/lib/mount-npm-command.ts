import { CommandInfo } from './command-info';

export function mountNpmCommand(
	command: string,
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
