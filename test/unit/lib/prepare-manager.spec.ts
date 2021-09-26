import { prepareManager } from '../../../src/lib/prepare-manager';
import * as dropNodeModulesLib from '../../../src/lib/drop-node-modules';
import fs = require('fs');

const packageLockPath = `${process.cwd()}/package-lock.json`;
describe(prepareManager.name, () => {
	let existsSync: jest.SpyInstance;

	beforeEach(() => {
		existsSync = jest.spyOn(fs, 'existsSync').mockReturnValue(true);
		jest
			.spyOn(dropNodeModulesLib, 'dropNodeModules')
			.mockReturnValue(['drop1', 'drop2'] as any);
		jest.spyOn(console, 'info').mockReturnValue(undefined);
	});

	it('should yield nothing when hasPNPM is false', () => {
		const result = Array.from(prepareManager(false, true));

		expectCallsLike(existsSync);
		expect(dropNodeModulesLib.dropNodeModules).toHaveCallsLike();
		expect(result).toEqual([]);
	});

	it('should yield nothing when package-lock does notexist', () => {
		existsSync.mockReturnValue(false);

		const result = Array.from(prepareManager(true, true));

		expectCallsLike(existsSync, [packageLockPath]);
		expect(dropNodeModulesLib.dropNodeModules).toHaveCallsLike([]);
		expect(result).toEqual([
			['npm', ['i', '--ignore-scripts']],
			['pnpm', ['import']],
			'drop1',
			'drop2',
		]);
	});

	it('should yield preparing commands when hasPNPM is true', () => {
		const result = Array.from(prepareManager(true, true));

		expectCallsLike(existsSync, [packageLockPath]);
		expect(result).toEqual([['pnpm', ['import']], 'drop1', 'drop2']);
	});

	it('should yield preparing commands when hasPNPM is true, but not drop when dropModule is false', () => {
		const result = Array.from(prepareManager(true));

		expectCallsLike(existsSync, [packageLockPath]);
		expect(result).toEqual([['pnpm', ['import']]]);
	});
});
