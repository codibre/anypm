import * as getCommandLib from '../../../src/lib/get-command';
import * as mountNpmCommandLib from '../../../src/lib/mount-npm-command';
import * as prepareOptionsLib from '../../../src/lib/prepare-options';
import * as lockLib from '../../../src/lib/has-no-package-lock';
import * as manageLocksLib from '../../../src/lib/manage-locks';
import * as installLib from '../../../src/lib/install';
import { Command } from '../../../src/lib/config';
import { auditFix } from '../../../src/lib/audit-fix';
import { properHoist } from '../../../src/lib/proper-hoist';

describe(fName(auditFix), () => {
	let hasNoPackageLock: jest.SpyInstance;
	let command: Command;

	beforeEach(() => {
		jest.spyOn(getCommandLib, 'getCommand').mockImplementation(async () => ({
			hasCommand: command !== 'npm',
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
		jest.spyOn(installLib, 'install').mockReturnValue([
			['install', ['1']],
			['install', ['2']],
		] as any);
	});

	it('should thrown an error when there is not package-lock', async () => {
		hasNoPackageLock.mockReturnValue(true);
		let thrownError: any;

		try {
			const result: any[] = [];
			for await (const item of auditFix({})) {
				result.push(item);
			}
		} catch (err) {
			thrownError = err;
		}

		expect(getCommandLib.getCommand).toHaveCallsLike();
		expect(prepareOptionsLib.prepareOptions).toHaveCallsLike();
		expect(mountNpmCommandLib.mountNpmCommand).toHaveCallsLike();
		expect(manageLocksLib.manageLocks).toHaveCallsLike();
		expect(thrownError).toBeInstanceOf(Error);
	});

	it('should run "npm auditFix" when command is npm', async () => {
		command = 'npm';
		const result: any[] = [];

		for await (const item of auditFix({})) {
			result.push(item);
		}

		expect(getCommandLib.getCommand).toHaveCallsLike([]);
		expect(prepareOptionsLib.prepareOptions).toHaveCallsLike([{}]);
		expect(mountNpmCommandLib.mountNpmCommand).toHaveCallsLike([
			'npm',
			'audit',
			['fix'],
		]);
		expect(manageLocksLib.manageLocks).toHaveCallsLike();
		expect(result).toEqual([['npm', ['audit', ['fix']]]]);
	});

	it('should run "pnpm install --frozen-lock-file" when command is npm', async () => {
		command = 'pnpm';
		const result: any[] = [];

		for await (const item of auditFix({})) {
			result.push(item);
		}

		expect(getCommandLib.getCommand).toHaveCallsLike([]);
		expect(prepareOptionsLib.prepareOptions).toHaveCallsLike([{}]);
		expect(mountNpmCommandLib.mountNpmCommand).toHaveCallsLike(
			['npm', 'audit', ['fix']],
			['pnpm', 'import', []],
			['pnpm', 'install', ['--frozen-lockfile', properHoist]],
		);
		expect(manageLocksLib.manageLocks).toHaveCallsLike([
			true,
			'prepared option',
		]);
		expect(result).toEqual([
			['npm', ['audit', ['fix']]],
			['pnpm', ['import', []]],
			['pnpm', ['install', ['--frozen-lockfile', properHoist]]],
			['finish', ['command1f']],
			['finish', ['command2f']],
		]);
	});
});
