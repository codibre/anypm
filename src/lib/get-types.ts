import { packageExists } from './package-exists';

export async function getTypes(packages: string[]) {
	return (
		await Promise.all(
			packages.map(async (pkg) => {
				if (!pkg.startsWith('@types')) {
					const typePackage = `@types/${
						pkg.startsWith('@') ? pkg.substring(1).replace('/', '__') : pkg
					}`;
					if (await packageExists(typePackage)) {
						return typePackage;
					}
				}
				return undefined;
			}),
		)
	).filter((x) => x) as string[];
}
