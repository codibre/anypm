import { readFileSync } from 'fs';
import { isAliasEnabled } from './is-alias-enabled';

export async function getNpm() {
	if (process.platform !== 'linux' || !(await isAliasEnabled())) {
		return 'npm';
	}
	const value = readFileSync('~/.anypmrc');
	return value.toString();
}
