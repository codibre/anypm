import { commandExists } from './command-exists';

export const PNPM = 'pnpm';
export const NPM = 'npm';

export async function getCommand() {
	const hasPNPM = !!(await commandExists(PNPM));
	const command = hasPNPM ? PNPM : NPM;
	return { hasPNPM, command };
}
