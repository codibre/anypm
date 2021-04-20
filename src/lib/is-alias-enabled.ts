import { runCmd } from './run-cmd';

export async function isAliasEnabled() {
	try {
		return (await runCmd('alias npm')).includes(' aliased ');
	} catch {
		return false;
	}
}
