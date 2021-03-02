import { runScript } from './exec';
import { packageExists } from './package-exists';

interface InstallOptions {
	keepLock: boolean;
	saveDev: boolean;
}

function mountAdd(saveDev: boolean, packages: string[]): [string, string[]] {
	const args = ['add'];
	if (saveDev) {
		args.push('-D');
	}
	args.push(...packages);
	return ['pnpm', args];
}

export async function install(packages: string[], options: InstallOptions) {
	return runScript(async function* (): AsyncIterable<[string, string[]]> {
		if (packages.length === 0 || options.keepLock) {
			yield ['pnpm', ['import']];
		}

		yield packages.length > 0
			? mountAdd(options.saveDev, packages)
			: ['pnpm', ['install']];

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
			yield mountAdd(true, types);
		}

		if (!options.keepLock) {
			yield ['rm', ['-rf', 'pnpm-lock.yaml']];
		}

		yield ['npm', ['install', '--package-lock-only']];
	});
}
