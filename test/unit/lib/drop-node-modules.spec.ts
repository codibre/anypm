import { dropNodeModules } from '../../../src/lib/drop-node-modules';
import * as mountNpmCommandLib from '../../../src/lib/mount-npm-command';

describe(fName(dropNodeModules), () => {
	beforeEach(() => {
		jest
			.spyOn(mountNpmCommandLib, 'mountNpmCommand')
			.mockReturnValue('command mounted' as any);
	});

	it('should emit node modules deletion', () => {
		const result = Array.from(dropNodeModules());

		expect(mountNpmCommandLib.mountNpmCommand).toHaveCallsLike([
			'npx',
			'del-cli',
			['node_modules'],
		]);
		expect(result).toEqual(['command mounted']);
	});
});
