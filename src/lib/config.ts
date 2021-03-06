import { existsSync } from 'fs';

export interface Config {
	keepLock: boolean;
	command: string;
}

let cache: Config | undefined;

const DEFAULT_CONFIG: Config = {
	keepLock: false,
	command: 'pnpm',
};
export function getConfig(): Config {
	if (!cache) {
		const path = `${process.cwd()}/anypmrc.json`;
		cache = existsSync(path)
			? ({
					...DEFAULT_CONFIG,
					...require(path),
			  } as Config)
			: DEFAULT_CONFIG;
	}

	return cache;
}
