import { CommandInfo } from './command-info';
import { mountNpmCommand } from './mount-npm-command';

export async function* nvmrc(): AsyncIterable<CommandInfo> {
	yield mountNpmCommand('sh', 'apply-nvmrc.sh', []);
}
