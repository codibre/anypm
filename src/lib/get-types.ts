import { packageExists } from './package-exists';

export async function getTypes(packages: string[]) {
	function* getPackages() {
		for (const pkg of packages) {
			if (!pkg.startsWith('@types')) {
				const typePackage = `@types/${
					pkg.startsWith('@') ? pkg.substring(1).replace('/', '__') : pkg
				}`;
				if (!packages.includes(typePackage)) {
					yield packageExists(typePackage).then((x) =>
						x ? typePackage : undefined,
					);
				}
			}
		}
	}

	return (await Promise.all(getPackages())).filter((x) => x) as string[];
}
