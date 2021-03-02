import { spawn } from 'child_process';

export async function runScript(commands: () => AsyncIterable<[string, string[]]>) {
	for await (const [command, args] of commands()) {
		await new Promise<void>((resolve, reject) => {
      const child = spawn(command, args, {
        stdio: [process.stdin, process.stdout, process.stderr],
      });
      child.on('exit', (x) =>x ? reject(x) : resolve());
    });
	}
}
