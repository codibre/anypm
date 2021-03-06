import { getConfig } from './config';

export interface BaseOptions {
	keepLock: boolean;
}

export function prepareOptions<T extends BaseOptions>(options: T) {
	if (typeof options.keepLock !== 'boolean') {
		const config = getConfig();
		return {
			...options,
			keepLock: typeof config.keepLock !== 'boolean' ? false : config.keepLock,
		};
	}

	return options;
}
