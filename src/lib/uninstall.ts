import { runScript } from './exec';
import { packageExists } from './package-exists';

interface InstallOptions {
	keepLock: boolean;
	saveDev: boolean;
}

function mountRemove(packages: string[]) {
	return `pnpm remove ${packages.join(' ')}`;
}

export async function uninstall(packages: string[], options: InstallOptions) {
	if (packages.length === 0) {
		throw new Error('You need to inform packages for uninstalling, champs!');
	}
	return runScript(async function* () {
		yield 'pnpm import';
		yield mountRemove(packages);

		const types = (
			await Promise.all(
				packages.map(async (pkg) => {
					if (!pkg.startsWith('@types')) {
						const typePackage = `@types/${pkg}`;
						if (await packageExists(typePackage)) {
							return typePackage;
						}
					}
					return undefined;
				}),
			)
		).filter((x) => x) as string[];

		if (types.length > 0) {
			yield mountRemove(types);
		}

		if (!options.keepLock) {
			yield 'rm -rf pnpm-lock.yaml';
		}

		yield 'npm install --package-lock-only';
	});
}
