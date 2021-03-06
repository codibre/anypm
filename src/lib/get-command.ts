import { commandExists } from './command-exists';
import { getConfig } from './config';

export const NPM = 'npm';

export async function getCommand() {
	const config = getConfig();
	const hasCommand = !!(await commandExists(config.command));
	const command = hasCommand ? config.command : NPM;
	return { hasCommand, command };
}
