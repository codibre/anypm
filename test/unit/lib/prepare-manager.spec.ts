import { prepareManager } from '../../../src/lib/prepare-manager';
import fs = require('fs');
import { expectCallsLike } from '../setup';

const packageLockPath = `${process.cwd()}/package-lock.json`;
describe(prepareManager.name, () => {
	let existsSync: jest.SpyInstance;

	beforeEach(() => {
		existsSync = jest.spyOn(fs, 'existsSync').mockReturnValue(true);
	});

	it('should yield nothing when hasPNPM is false', () => {
		const result = Array.from(prepareManager(false));

		expectCallsLike(existsSync);
		expect(result).toEqual([]);
	});

	it('should yield nothing when package-lock does notexist', () => {
		existsSync.mockReturnValue(false);

		const result = Array.from(prepareManager(true));

		expectCallsLike(existsSync, [packageLockPath]);
		expect(result).toEqual([
			['npm', ['i']],
			['npx', ['del-cli', 'node_modules']],
		]);
	});

	it('should yield preparing commands when hasPNPM is true', () => {
		const result = Array.from(prepareManager(true));

		expectCallsLike(existsSync, [packageLockPath]);
		expect(result).toEqual([['npx', ['del-cli', 'node_modules']]]);
	});
});
