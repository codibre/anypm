import { exec } from 'child_process';

export async function runScript(commands: () => AsyncIterable<string>) {
	for await (const command of commands()) {
		await new Promise<void>((resolve, reject) => {
      exec(command, (err, stdout, stderr) => {
        if (stdout) {
          console.info(stdout);
        }
        if (stdout) {
          console.error(stderr);
        }
        if (err) {
          resolve();
        } else {
          reject(err);
        }
      });
    });
	}
}
