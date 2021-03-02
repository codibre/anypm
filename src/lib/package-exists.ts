const NpmApi = require('npm-api');
const npm = new NpmApi();

export function packageExists(pkg: string) {
	return npm
		.repo(pkg)
		.prop('deprecated')
		.then((x: string) => !x)
		.catch(() => false);
}
