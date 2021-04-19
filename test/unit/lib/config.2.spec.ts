jest.mock(`${process.cwd()}/anypmrc.json`, () => ({
	command: 'newCommand',
	conf1: 1,
	conf2: 2,
	conf3: 3,
}));
import * as fs from 'fs';
import { getConfig } from '../../../src/lib/config';

describe(getConfig.name, () => {
	const path = `${process.cwd()}/anypmrc.json`;
	let existsSync: jest.SpyInstance;

	beforeEach(() => {
		existsSync = jest.spyOn(fs, 'existsSync');
	});

	it('should return default config merged with config file when config file exists', () => {
		existsSync.mockReturnValue(true);

		const result = getConfig();

		expectCallsLike(fs.existsSync, [path]);
		expect(result).toEqual({
			keepLock: false,
			command: 'newCommand',
			conf1: 1,
			conf2: 2,
			conf3: 3,
		});
	});
});
