import { install } from '../../../src/lib/install';
import * as getCommandLib from '../../../src/lib/get-command';
import * as mountNpmCommandLib from '../../../src/lib/mount-npm-command';
import * as prepareOptionsLib from '../../../src/lib/prepare-options';
import * as lockLib from '../../../src/lib/has-no-package-lock';
import * as manageLocksLib from '../../../src/lib/manage-locks';
import * as dropNodeModulesLib from '../../../src/lib/drop-node-modules';
import { Command } from '../../../src/lib/config';
import { ci } from '../../../src/lib/ci';

describe(install.name, () => {
	let hasNoPackageLock: jest.SpyInstance;
	let command: Command;

	beforeEach(() => {
		jest.spyOn(getCommandLib, 'getCommand').mockImplementation(async () => ({
			hasCommand: 'hasPNPM value' as any,
			command,
		}));
		jest
			.spyOn(mountNpmCommandLib, 'mountNpmCommand')
			.mockImplementation((...[a, ...others]: any[]) => [a, others]);
		jest
			.spyOn(prepareOptionsLib, 'prepareOptions')
			.mockReturnValue('prepared option' as any);
		hasNoPackageLock = jest
			.spyOn(lockLib, 'hasNoPackageLock')
			.mockReturnValue(false);
		jest.spyOn(manageLocksLib, 'manageLocks').mockReturnValue([
			['finish', ['command1f']],
			['finish', ['command2f']],
		]);
		jest.spyOn(dropNodeModulesLib, 'dropNodeModules').mockReturnValue([
			['drop', ['modules1']],
			['drop', ['modules2']],
		] as any);
	});

	it('should thrown an error when there is not package-lock', async () => {
		hasNoPackageLock.mockReturnValue(true);
		let thrownError: any;

		try {
			const result: any[] = [];
			for await (const item of ci({})) {
				result.push(item);
			}
		} catch (err) {
			thrownError = err;
		}

		expect(getCommandLib.getCommand).toHaveCallsLike();
		expect(prepareOptionsLib.prepareOptions).toHaveCallsLike();
		expect(dropNodeModulesLib.dropNodeModules).toHaveCallsLike();
		expect(mountNpmCommandLib.mountNpmCommand).toHaveCallsLike();
		expect(manageLocksLib.manageLocks).toHaveCallsLike();
		expect(thrownError).toBeInstanceOf(Error);
	});

	it('should run "npm ci" when command is npm', async () => {
		command = 'npm';
		const result: any[] = [];

		for await (const item of ci({})) {
			result.push(item);
		}

		expect(getCommandLib.getCommand).toHaveCallsLike([]);
		expect(prepareOptionsLib.prepareOptions).toHaveCallsLike([{}]);
		expect(dropNodeModulesLib.dropNodeModules).toHaveCallsLike([]);
		expect(mountNpmCommandLib.mountNpmCommand).toHaveCallsLike([
			'npm',
			'ci',
			[],
		]);
		expect(manageLocksLib.manageLocks).toHaveCallsLike([
			'hasPNPM value',
			'prepared option',
		]);
		expect(result).toEqual([
			['drop', ['modules1']],
			['drop', ['modules2']],
			['npm', ['ci', []]],
			['finish', ['command1f']],
			['finish', ['command2f']],
		]);
	});

	it('should run "pnpm install --frozen-lock-file" when command is npm', async () => {
		command = 'pnpm';
		const result: any[] = [];

		for await (const item of ci({})) {
			result.push(item);
		}

		expect(getCommandLib.getCommand).toHaveCallsLike([]);
		expect(prepareOptionsLib.prepareOptions).toHaveCallsLike([{}]);
		expect(dropNodeModulesLib.dropNodeModules).toHaveCallsLike([]);
		expect(mountNpmCommandLib.mountNpmCommand).toHaveCallsLike(
			['pnpm', 'import', []],
			['pnpm', 'install', ['--frozen-lockfile']],
		);
		expect(manageLocksLib.manageLocks).toHaveCallsLike([
			'hasPNPM value',
			'prepared option',
		]);
		expect(result).toEqual([
			['drop', ['modules1']],
			['drop', ['modules2']],
			['pnpm', ['import', []]],
			['pnpm', ['install', ['--frozen-lockfile']]],
			['finish', ['command1f']],
			['finish', ['command2f']],
		]);
	});
});
