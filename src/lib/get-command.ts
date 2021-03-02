import { commandExists } from './command-exists';

export async function getCommand() {
	const hasPNPM = !!(await commandExists('pnpm'));
	const command = hasPNPM ? 'pnpm' : 'npm';
	return { hasPNPM, command };
}
