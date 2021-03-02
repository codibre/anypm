import { runScript } from './exec';
import { getTypes } from './get-types';

interface InstallOptions {
	keepLock: boolean;
	saveDev: boolean;
}

function mountRemove(packages: string[]): [string, string[]] {
	return ['pnpm', ['remove', ...packages]];
}

export async function uninstall(packages: string[], options: InstallOptions) {
	if (packages.length === 0) {
		throw new Error('You need to inform packages for uninstalling, champs!');
	}
	return runScript(async function* (): AsyncIterable<[string, string[]]> {
		yield ['pnpm', ['import']];
		yield mountRemove(packages);

		const types = await getTypes(packages);

		if (types.length > 0) {
			yield mountRemove(types);
		}

		if (!options.keepLock) {
			yield ['rm', ['-rf', 'pnpm-lock.yaml']];
		}

		yield ['npm', ['install', '--package-lock-only']];
	});
}
