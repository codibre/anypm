import { exec } from 'child_process';

export async function runCmd(cmd: string): Promise<string> {
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
		console.error(`Command ${cmd} failed: ${err.message}`);
		process.exit(-1);
	}
}
