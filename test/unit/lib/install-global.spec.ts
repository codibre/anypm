import { install } from '../../../src/lib/install';
import * as getCommandLib from '../../../src/lib/get-command';
import * as mountNpmCommandLib from '../../../src/lib/mount-npm-command';
import * as prepareManagerLib from '../../../src/lib/prepare-manager';
import * as getTypesLib from '../../../src/lib/get-types';
import * as manageLocksLib from '../../../src/lib/manage-locks';

describe('install -g behavior', () => {
	const typesPack = ['@types/pack1'];

	beforeEach(() => {
		jest.spyOn(getCommandLib, 'getCommand').mockResolvedValue({
			hasCommand: 'hasPNPM value' as any,
			command: 'myNPM' as any,
		});
		jest
			.spyOn(mountNpmCommandLib, 'mountNpmCommand')
			.mockImplementation((...[a, ...others]: any[]) => [a, others]);
		jest.spyOn(prepareManagerLib, 'prepareManager').mockReturnValue([
			['prepare', ['command1']],
			['prepare2', ['command2']],
		]);
		jest.spyOn(getTypesLib, 'getTypes').mockResolvedValue([...typesPack]);
		jest.spyOn(manageLocksLib, 'manageLocks').mockReturnValue([
			['finish', ['command1f']],
			['finish', ['command2f']],
		]);
	});

	it('installs current package globally when -g and no packages', async () => {
		const packs: string[] = [];
		const options = {
			keepLock: false,
			saveDev: 'saveDev value' as any,
			global: true,
		} as any;

		const iterable = install(packs, options);
		const result: any[] = [];
		for await (const item of iterable) {
			result.push(item);
		}

		expect(prepareManagerLib.prepareManager).not.toHaveBeenCalled();
		expectCallsLike(mountNpmCommandLib.mountNpmCommand, [
			'myNPM',
			'install',
			['-g', '.'],
			'saveDev value',
		]);
		expect(manageLocksLib.manageLocks).not.toHaveBeenCalled();
		expect(result).toEqual([
			['myNPM', ['install', ['-g', '.'], 'saveDev value']],
		]);
	});

	it('installs specific packages globally and their types', async () => {
		const packs = ['pack1'];
		const options = {
			keepLock: true,
			saveDev: false,
			global: true,
		} as any;

		const iterable = install(packs, options);
		const result: any[] = [];
		for await (const item of iterable) {
			result.push(item);
		}

		expect(prepareManagerLib.prepareManager).not.toHaveBeenCalled();
		expectCallsLike(getTypesLib.getTypes, [packs]);
		expectCallsLike(
			mountNpmCommandLib.mountNpmCommand,
			['myNPM', 'install', ['-g', 'pack1'], false],
			['myNPM', 'install', ['-g', '@types/pack1'], true],
		);

		expect(manageLocksLib.manageLocks).not.toHaveBeenCalled();
	});
});
