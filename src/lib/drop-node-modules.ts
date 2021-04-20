import { mountNpmCommand } from './mount-npm-command';

export function* dropNodeModules() {
	console.info('Dropping current node_modules...');
	yield mountNpmCommand('npx', 'del-cli', ['node_modules']);
}
