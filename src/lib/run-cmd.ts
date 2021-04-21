import { exec } from 'child_process';

export async function runCmd(
	cmd: string,
	defaultReturn?: string,
): Promise<string> {
	try {
		return new Promise((resolve, reject) => {
			exec(cmd, function (err, stdout, stderr) {
				if (err || stderr) {
					reject(new Error(err?.message || stderr));
				} else {
					resolve(stdout);
				}
			});
		});
	} catch (err) {
		if (defaultReturn === undefined) {
			console.error(`Command ${cmd} failed: ${err.message}`);
			process.exit(-1);
		} else {
			return defaultReturn;
		}
	}
}
