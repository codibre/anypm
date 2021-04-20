import { commandExists } from './command-exists';
import { getConfig } from './config';
import { getNpm } from './get-npm';

export async function getCommand() {
	const config = getConfig();
	const hasCommand = !!(await commandExists(config.command));
	const command = hasCommand ? config.command : await getNpm();
	return { hasCommand, command };
}
