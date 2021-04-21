import { mountNpmCommand } from './mount-npm-command';
import { replaceNpm } from './replace-npm';
import { runScriptFactory } from './run-script-factory';

export async function nvmrc() {
	await runScriptFactory(() => [mountNpmCommand('sh', 'apply-nvmrc.sh', [])])();
	await replaceNpm();
}
