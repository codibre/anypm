import { isAliasEnabled } from './is-alias-enabled';
import { runCmd } from './run-cmd';

export async function getNpm() {
	if (process.platform !== 'linux' || !(await isAliasEnabled())) {
		return 'npm';
	}
	return runCmd('alias realNpm', 'npm');
}
