import { existsSync } from 'fs';

export function hasNoPackageLock() {
	return !existsSync(`${process.cwd()}/package-lock.json`);
}
