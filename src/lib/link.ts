import { mountNpmCommand } from './mount-npm-command';
import { getCommand } from './get-command';
import { BaseOptions, prepareOptions } from './prepare-options';

export interface LinkOptions extends BaseOptions {
	global?: boolean;
}

export async function* link(
	packages: string[] = [],
	informedOptions: LinkOptions = {},
) {
	const options = prepareOptions(informedOptions);
	const { command } = await getCommand();

	const args = [...(packages || [])];
	if (options.global) {
		args.unshift('-g');
	}

	yield mountNpmCommand(command, 'link', args);
}
