jest.mock(`${process.cwd()}/anypmrc.json`, () => ({
	command: 'newCommand',
	conf1: 1,
	conf2: 2,
	conf3: 3,
}));
import * as fs from 'fs';
import { getConfig } from '../../../src/lib/config';
import { expectCallsLike } from '../setup';

describe(getConfig.name, () => {
	const path = `${process.cwd()}/anypmrc.json`;
	let existsSync: jest.SpyInstance;

	beforeEach(() => {
		existsSync = jest.spyOn(fs, 'existsSync');
	});

	it('should check config only once and then return cached result', () => {
		existsSync.mockReturnValue(true);

		const result1 = getConfig();
		const result2 = getConfig();

		expectCallsLike(fs.existsSync, [path]);
		expect(result1).toEqual({
			keepLock: false,
			command: 'newCommand',
			conf1: 1,
			conf2: 2,
			conf3: 3,
		});
		expect(result2).toBe(result1);
	});
});
