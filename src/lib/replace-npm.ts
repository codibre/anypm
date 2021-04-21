import { isAliasEnabled } from './is-alias-enabled';
import { runCmd } from './run-cmd';

export async function replaceNpm() {
	if (process.platform !== 'linux') {
		throw new Error('We can only replace npm command currently in linux!');
	}
	console.info('Preparing npm replacement...');
	if (await isAliasEnabled()) {
		await runCmd('unalias npm');
	}

	const npmPath = await runCmd('which npm');
	await runCmd(`alias realnpm=${npmPath}`);
	await runCmd('alias npm=anypm');
	console.info('Npm replaced successfully! Run alias npm=anypm to finalize!');
}
