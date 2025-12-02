import { uninstall } from '../../../src/lib/uninstall';
import * as prepareOptionsLib from '../../../src/lib/prepare-options';
import * as getCommandLib from '../../../src/lib/get-command';
import * as mountNpmCommandLib from '../../../src/lib/mount-npm-command';
import * as getTypesLib from '../../../src/lib/get-types';
import * as manageLocksLib from '../../../src/lib/manage-locks';
import { sync } from 'read-pkg';

const project = sync();
const ref = new Set([
	...Object.keys(project.dependencies || {}),
	...Object.keys(project.devDependencies || {}),
]);

describe(uninstall.name, () => {
	const typesPack = ['@types/pack1', '@types/pack2'];

	beforeEach(() => {
		jest
			.spyOn(prepareOptionsLib, 'prepareOptions')
			.mockReturnValue('my prepared options' as any);
		jest.spyOn(getCommandLib, 'getCommand').mockResolvedValue({
			hasCommand: 'hasPNPM value' as any,
			command: 'myNPM' as any,
		});
		jest
			.spyOn(mountNpmCommandLib, 'mountNpmCommand')
			.mockImplementation((...[a, ...others]: any[]) => [a, others]);
		jest.spyOn(getTypesLib, 'getTypes').mockResolvedValue(typesPack);
		jest.spyOn(manageLocksLib, 'manageLocks').mockReturnValue([
			['finish', ['command1f']],
			['finish', ['command2f']],
		]);
	});

	it('should mount commands with preparing when keepLock is true', async () => {
		const packs = [
			'commander',
			'npm-api',
			'read-pkg',
		];
		const options = 'my options' as any;

		const iterable = uninstall(packs, options);
		const result: any[] = [];
		for await (const item of iterable) {
			result.push(item);
		}

		expectCallsLike(prepareOptionsLib.prepareOptions, ['my options']);
		expectCallsLike(getCommandLib.getCommand, []);
		expectCallsLike(getTypesLib.getTypes, [packs, ref]);
		expectCallsLike(mountNpmCommandLib.mountNpmCommand, [
			'myNPM',
			'uninstall',
			[...packs, ...typesPack],
			undefined,
		]);
		expectCallsLike(manageLocksLib.manageLocks, [
			'hasPNPM value',
			'my prepared options',
		]);
		expect(result).toEqual([
			['myNPM', ['uninstall', [...packs, ...typesPack], undefined]],
			['finish', ['command1f']],
			['finish', ['command2f']],
		]);
	});

	it('should mount commands with no type installing when there is not types to uninstall', async () => {
		const packs = [
			'commander',
			'npm-api',
			'read-pkg',
		];
		const options = 'my options' as any;
		jest.spyOn(getTypesLib, 'getTypes').mockResolvedValue([]);

		const iterable = uninstall(packs, options);
		const result: any[] = [];
		for await (const item of iterable) {
			result.push(item);
		}

		expectCallsLike(prepareOptionsLib.prepareOptions, ['my options']);
		expectCallsLike(getCommandLib.getCommand, []);
		expectCallsLike(getTypesLib.getTypes, [packs, ref]);
		expectCallsLike(mountNpmCommandLib.mountNpmCommand, [
			'myNPM',
			'uninstall',
			packs,
			undefined,
		]);
		expectCallsLike(manageLocksLib.manageLocks, [
			'hasPNPM value',
			'my prepared options',
		]);
		expect(result).toEqual([
			['myNPM', ['uninstall', packs, undefined]],
			['finish', ['command1f']],
			['finish', ['command2f']],
		]);
	});
});
