import { mountNpmCommand } from './mount-npm-command';
import { properHoist } from './proper-hoist';

export function* frozenInstall(command: string) {
	if (command === 'pnpm') {
		yield mountNpmCommand('pnpm', 'import', []);
		yield mountNpmCommand('pnpm', 'install', [
			'--frozen-lockfile',
			properHoist,
		]);
	} else {
		throw new Error(`Frozen install not supported for ${command} yet`);
	}
}
