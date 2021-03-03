import which = require('which');

export async function commandExists(command: string) {
	return new Promise<boolean>((resolve) =>
		which(command, (err) => resolve(!err)),
	);
}
