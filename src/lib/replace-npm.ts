import { writeFileSync } from 'fs';
import { isAliasEnabled } from './is-alias-enabled';
import { runCmd } from './run-cmd';
import { homedir } from 'os';

export async function replaceNpm() {
	if (process.platform !== 'linux') {
		throw new Error('We can only replace npm command currently in linux!');
	}
	console.info('Preparing npm replacement...');
	if (await isAliasEnabled()) {
		await runCmd('unalias npm');
	}

	const npmPath = await runCmd('which npm');
	writeFileSync(`${homedir()}/.anypmrc`, npmPath, {
		flag: 'w',
	});
	await runCmd('alias npm=anypm');
	console.info('Npm replaced successfully! Run alias npm=anypm to finalize!');
}
