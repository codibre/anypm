import { install } from '../../../src/lib/install';
import * as getCommandLib from '../../../src/lib/get-command';
import * as mountNpmCommandLib from '../../../src/lib/mount-npm-command';
import * as prepareManagerLib from '../../../src/lib/prepare-manager';
import * as getTypesLib from '../../../src/lib/get-types';
import * as manageLocksLib from '../../../src/lib/manage-locks';
import { expectCallsLike } from '../setup';

describe(install.name, () => {
	const typesPack = ['@types/pack1', '@types/pack2'];

	beforeEach(() => {
		jest
			.spyOn(getCommandLib, 'getCommand')
			.mockResolvedValue({ hasPNPM: 'hasPNPM value' as any, command: 'myNPM' });
		jest
			.spyOn(mountNpmCommandLib, 'mountNpmCommand')
			.mockImplementation((...[a, ...others]: any[]) => [a, others]);
		jest.spyOn(prepareManagerLib, 'prepareManager').mockReturnValue([
			['prepare', ['command1']],
			['prepare2', ['command2']],
		]);
		jest.spyOn(getTypesLib, 'getTypes').mockResolvedValue(typesPack);
		jest.spyOn(manageLocksLib, 'manageLocks').mockReturnValue([
			['finish', ['command1f']],
			['finish', ['command2f']],
		]);
	});

	it('should mount commands with preparing when keepLock is true', async () => {
		const packs = ['pack1', 'pack2', 'pack3'];
		const options = {
			keepLock: true,
			saveDev: 'saveDev value' as any,
		};

		const iterable = install(packs, options);
		const result: any[] = [];
		for await (const item of iterable) {
			result.push(item);
		}

		expectCallsLike(getCommandLib.getCommand, []);
		expectCallsLike(prepareManagerLib.prepareManager, ['hasPNPM value']);
		expectCallsLike(getTypesLib.getTypes, [packs]);
		expectCallsLike(
			mountNpmCommandLib.mountNpmCommand,
			['myNPM', 'install', packs, 'saveDev value'],
			['myNPM', 'install', typesPack, true],
		);
		expectCallsLike(manageLocksLib.manageLocks, ['hasPNPM value', options]);
		expect(result).toEqual([
			['prepare', ['command1']],
			['prepare2', ['command2']],
			['myNPM', ['install', packs, 'saveDev value']],
			['myNPM', ['install', typesPack, true]],
			['finish', ['command1f']],
			['finish', ['command2f']],
		]);
	});

	it('should mount commands with preparing when packs is empty', async () => {
		const packs: string[] = [];
		const options = {
			keepLock: false,
			saveDev: 'saveDev value' as any,
		};

		const iterable = install(packs, options);
		const result: any[] = [];
		for await (const item of iterable) {
			result.push(item);
		}

		expectCallsLike(getCommandLib.getCommand, []);
		expectCallsLike(prepareManagerLib.prepareManager, ['hasPNPM value']);
		expectCallsLike(getTypesLib.getTypes);
		expectCallsLike(mountNpmCommandLib.mountNpmCommand, [
			'myNPM',
			'install',
			packs,
			'saveDev value',
		]);
		expectCallsLike(manageLocksLib.manageLocks, ['hasPNPM value', options]);
		expect(result).toEqual([
			['prepare', ['command1']],
			['prepare2', ['command2']],
			['myNPM', ['install', packs, 'saveDev value']],
			['finish', ['command1f']],
			['finish', ['command2f']],
		]);
	});

	it('should mount commands with no preparing when keepLock is false and packs is not empty', async () => {
		const packs = ['pack1', 'pack2', 'pack3'];
		const options = {
			keepLock: false,
			saveDev: 'saveDev value' as any,
		};

		const iterable = install(packs, options);
		const result: any[] = [];
		for await (const item of iterable) {
			result.push(item);
		}

		expectCallsLike(getCommandLib.getCommand, []);
		expectCallsLike(prepareManagerLib.prepareManager);
		expectCallsLike(getTypesLib.getTypes, [packs]);
		expectCallsLike(
			mountNpmCommandLib.mountNpmCommand,
			['myNPM', 'install', packs, 'saveDev value'],
			['myNPM', 'install', typesPack, true],
		);
		expectCallsLike(manageLocksLib.manageLocks, ['hasPNPM value', options]);
		expect(result).toEqual([
			['myNPM', ['install', packs, 'saveDev value']],
			['myNPM', ['install', typesPack, true]],
			['finish', ['command1f']],
			['finish', ['command2f']],
		]);
	});

	it('should mount commands with no type installing when there is not types to install', async () => {
		const packs = ['pack1', 'pack2', 'pack3'];
		const options = {
			keepLock: false,
			saveDev: 'saveDev value' as any,
		};
		jest.spyOn(getTypesLib, 'getTypes').mockResolvedValue([]);

		const iterable = install(packs, options);
		const result: any[] = [];
		for await (const item of iterable) {
			result.push(item);
		}

		expectCallsLike(getCommandLib.getCommand, []);
		expectCallsLike(prepareManagerLib.prepareManager);
		expectCallsLike(getTypesLib.getTypes, [packs]);
		expectCallsLike(mountNpmCommandLib.mountNpmCommand, [
			'myNPM',
			'install',
			packs,
			'saveDev value',
		]);
		expectCallsLike(manageLocksLib.manageLocks, ['hasPNPM value', options]);
		expect(result).toEqual([
			['myNPM', ['install', packs, 'saveDev value']],
			['finish', ['command1f']],
			['finish', ['command2f']],
		]);
	});
});
